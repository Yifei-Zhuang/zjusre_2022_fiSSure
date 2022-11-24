const IssueSchema = require('../models/issue');
const {Octokit} = require('@octokit/core');
const config = require('../config');
const {default: mongoose} = require('mongoose');
const {
  YearCounter,
  MonthCounter,
  DayCounter,
  AsyncFunctionWrapper,
} = require('./index');
const {createCustomError} = require('../errors/custom-error');
const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN || config.GITHUB_ACCESS_TOKEN,
});
const {Mutex} = require('async-mutex');

let PageMutex = new Mutex();
let PAGE_NUM = 0;
const GetPageNum = async () => {
  let release = await PageMutex.acquire();
  let returnVal = PAGE_NUM;
  PAGE_NUM++;
  release();
  return returnVal;
};
const AsyncFetchIssueInfo = async (owner, repo) => {
  // 检查repo是否存在
  const repoResponse = await octokit.request('GET /repos/{owner}/{repo}', {
    owner: owner,
    repo: repo,
  });
  while (1) {
    const page_num = await GetPageNum();
    const per_page = 100;
    const issueMessage = await octokit.request(
      'GET /repos/{owner}/{repo}/issues',
      {
        owner: owner,
        repo: repo,
        state: 'all',
        page: page_num,
        per_page: per_page,
        since: new Date(
          new Date().getTime() - 365 * 24 * 60 * 60 * 1000,
        ).toString(),
      },
    );

    // if (page_num > 600 || issueMessage.data.length == 0) {
    if (issueMessage.data.length == 0) {
      // 最多60000条
      console.log(`fetch issue msg finish! total ${page_num} pages`);
      break;
    }

    for (const issue of issueMessage.data) {
      let issueObject;
      try {
        issueObject = await IssueSchema.findOne({
          id: issue.id,
        });
      } catch (error) {
        console.log(error);
      }
      if (!issueObject) {
        try {
          // console.log(pull);
          // break;
          const newIssue = {
            id: issue.id,
            url: issue.html_url,
            number: issue.number,
            state: issue.state,
            title: issue.title,
            isLocked: issue.locked,
            body: issue.body ? issue.body : 'test',
            created_at: issue.created_at,
            updated_at: issue.updated_at,
            closed_at: issue.closed_at ? issue.closed_at : undefined,
            repos_id: repoResponse.data.id,
            user_id: issue.user ? issue.user.id : 65600975,
            user_name: issue.user ? issue.user.login : 'pytorch',
            comment_count: issue.comments,
            repo_owner: issue.html_url.split('/')[3],
            repo_name: issue.html_url.split('/')[4],
          };
          const CreateIssue = await IssueSchema.create(newIssue);
        } catch (e) {
          console.log(e);
        }
      } else {
        issueObject.state = issue.state;
        issueObject.updated_at = issue.updated_at;
        issueObject.closed_at = issue.closed_at ? issue.closed_at : undefined;
        await issueObject.save();
      }
    }
  }
};
/**
 * @brief 获取指定仓库的issue记录（最多10000条）
 * @method post
 * @param {*} owner
 * @param {*} repo
 */
const GetIssueInfo = async (owner, repo) => {
  try {
    await AsyncFunctionWrapper(AsyncFetchIssueInfo, owner, repo);
    console.log('issue fetch finish');
  } catch (err) {
    throw createCustomError(err, 500);
  } finally {
    PAGE_NUM = 0;
  }
};

/**
 * @brief 获取指定年份之间的issue更新频率
 * @method post
 * @param {*} req
 * @body
 * {
 *    begin: time format like 2016-11-12’
 *    tail: time format like 2016-11-12’
 *    owner: repo_owner,
 *    repo: repo_name
 * }
 * @param {*} res
 * @attention 第一年和最后一年独立成年
 */
const GetRepoIssueUpdateFrequencyByYear = async (owner, repo) => {
  try {
    if (!owner || !repo) {
      throw 'missing body data';
    }
    const IssueInRange = await IssueSchema.find({
      repo_owner: owner,
      repo_name: repo,
    }).sort([['updated_at', 1]]);
    const begin = IssueInRange[0].created_at;
    return await YearCounter(IssueInRange, 'updated_at', begin);
  } catch (e) {
    throw createCustomError(e, 500);
  }
};
/**
 * @brief 获取指定年份之间的issue Create频率
 * @method post
 * @param {*} req
 * @body
 * {
 *    begin: time format like 2016-11-12’
 *    tail: time format like 2016-11-12’
 *    owner: repo_owner,
 *    repo: repo_name
 * }
 * @param {*} res
 * @attention 第一年和最后一年独立成年
 */
const GetRepoIssueCreateFrequencyByYear = async (owner, repo) => {
  try {
    if (!owner || !repo) {
      throw 'missing body data';
    }
    const IssueInRange = await IssueSchema.find({
      repo_owner: owner,
      repo_name: repo,
    }).sort([['created_at', 1]]);
    const begin = IssueInRange[0].created_at;
    return await YearCounter(IssueInRange, 'created_at', begin);
  } catch (e) {
    throw createCustomError(e, 500);
  }
};
/**
 * @brief 获取指定年份之间的issue close频率
 * @method post
 * @param {*} req
 * @body
 * {
 *    begin: time format like 2016-11-12’
 *    tail: time format like 2016-11-12’
 *    owner: repo_owner,
 *    repo: repo_name
 * }
 * @param {*} res
 * @attention 第一年和最后一年独立成年
 */
const GetRepoIssueCloseFrequencyByYear = async (owner, repo) => {
  try {
    if (!owner || !repo) {
      throw 'missing body data';
    }
    const IssueInRange = await IssueSchema.find({
      repo_owner: owner,
      repo_name: repo,
    }).sort([['closed_at', 1]]);
    const begin = IssueInRange[0].created_at;
    return await YearCounter(IssueInRange, 'closed_at', begin);
  } catch (e) {
    throw createCustomError(e, 500);
  }
};
/**
 * @brief 获取指定月份之间的issue update频率
 * @method post
 * @param {*} req
 * @body
 * {
 *    begin: time format like 2016-11-12’
 *    tail: time format like 2016-11-12’
 *    owner: repo_owner,
 *    repo: repo_name
 * }
 * @param {*} res
 * @attention 第一月和最后一月独立成月
 */
const GetRepoIssueUpdateFrequencyByMonth = async (owner, repo) => {
  try {
    if (!owner || !repo) {
      throw 'missing body data';
    }
    const IssueInRange = await IssueSchema.find({
      repo_owner: owner,
      repo_name: repo,
    }).sort([['updated_at', 1]]);
    const begin = IssueInRange[0].created_at;
    return await MonthCounter(IssueInRange, 'updated_at', begin);
  } catch (e) {
    throw createCustomError(e, 500);
  }
};
/**
 * @brief 获取指定月份之间的issue create频率
 * @method post
 * @param {*} req
 * @body
 * {
 *    begin: time format like 2016-11-12’
 *    tail: time format like 2016-11-12’
 *    owner: repo_owner,
 *    repo: repo_name
 * }
 * @param {*} res
 * @attention 第一月和最后一月独立成月
 */
const GetRepoIssueCreateFrequencyByMonth = async (owner, repo) => {
  try {
    if (!owner || !repo) {
      throw 'missing body data';
    }
    const IssueInRange = await IssueSchema.find({
      repo_owner: owner,
      repo_name: repo,
    }).sort([['created_at', 1]]);
    const begin = IssueInRange[0].created_at;
    return await MonthCounter(IssueInRange, 'created_at', begin);
  } catch (e) {
    throw createCustomError(e, 500);
  }
};
/**
 * @brief 获取指定月份之间的issue close频率
 * @method post
 * @param {*} req
 * @body
 * {
 *    begin: time format like 2016-11-12’
 *    tail: time format like 2016-11-12’
 *    owner: repo_owner,
 *    repo: repo_name
 * }
 * @param {*} res
 * @attention 第一月和最后一月独立成月
 */
const GetRepoIssueCloseFrequencyByMonth = async (owner, repo) => {
  try {
    if (!owner || !repo) {
      throw 'missing body data';
    }
    const IssueInRange = await IssueSchema.find({
      repo_owner: owner,
      repo_name: repo,
    }).sort([['closed_at', 1]]);
    const begin = IssueInRange[0].created_at;
    return await MonthCounter(IssueInRange, 'closed_at', begin);
  } catch (e) {
    throw createCustomError(e, 500);
  }
};
/**
 * @brief 获取指定日子之间的issue update频率
 * @method post
 * @param {*} req
 * @body
 * {
 *    begin: time format like 2016-11-12’
 *    tail: time format like 2016-11-12’
 *    owner: repo_owner,
 *    repo: repo_name
 * }
 * @param {*} res
 */
const GetRepoIssueUpdateFrequencyByDay = async (owner, repo) => {
  try {
    if (!owner || !repo) {
      throw 'missing body data';
    }
    const IssueInRange = await IssueSchema.find({
      repo_owner: owner,
      repo_name: repo,
    }).sort([['updated_at', 1]]);
    const begin = IssueInRange[0].created_at;
    return await DayCounter(IssueInRange, 'updated_at', begin);
  } catch (e) {
    throw createCustomError(e, 500);
  }
};
/**
 * @brief 获取指定日子之间的issue create频率
 * @method post
 * @param {*} req
 * @body
 * {
 *    begin: time format like 2016-11-12’
 *    tail: time format like 2016-11-12’
 *    owner: repo_owner,
 *    repo: repo_name
 * }
 * @param {*} res
 */
const GetRepoIssueCreateFrequencyByDay = async (owner, repo) => {
  try {
    if (!owner || !repo) {
      throw 'missing body data';
    }
    const IssueInRange = await IssueSchema.find({
      repo_owner: owner,
      repo_name: repo,
    }).sort([['created_at', 1]]);
    const begin = IssueInRange[0].created_at;
    return await DayCounter(IssueInRange, 'created_at', begin);
  } catch (e) {
    throw createCustomError(e, 500);
  }
};
/**
 * @brief 获取指定日子之间的issue close频率
 * @method post
 * @param {*} req
 * @body
 * {
 *    begin: time format like 2016-11-12’
 *    tail: time format like 2016-11-12’
 *    owner: repo_owner,
 *    repo: repo_name
 * }
 * @param {*} res
 */
const GetRepoIssueCloseFrequencyByDay = async (owner, repo) => {
  try {
    if (!owner || !repo) {
      throw 'missing body data';
    }
    const IssueInRange = await IssueSchema.find({
      repo_owner: owner,
      repo_name: repo,
    }).sort([['closed_at', 1]]);
    const begin = IssueInRange[0].created_at;
    return await DayCounter(IssueInRange, 'closed_at', begin);
  } catch (e) {
    throw createCustomError(e, 500);
  }
};
/**
 * @brief 获取指定日子之间的累计issuers数量
 * @method post
 * @param {*} req
 * @body
 * {
 *    begin: time format like 2016-11-12’
 *    tail: time format like 2016-11-12’
 *    owner: repo_owner,
 *    repo: repo_name
 * }
 * @param {*} res
 */
const GetIssuersCountInRange = async (owner, repo) => {
  try {
    if (!owner || !repo) {
      throw 'missing body data';
    }
    const IssueInRange = await IssueSchema.find({
      repo_owner: owner,
      repo_name: repo,
    }).sort([['updated_at', 1]]);
    const begin = IssueInRange[0].created_at;
    const BaseYear = begin ? begin.split('-')[0] : '2008';
    const BaseMonth = begin ? begin.split('-')[1] : '3';
    const LastYear = new Date().getUTCFullYear();
    const LastMonth = new Date().toISOString().split('-')[1];
    const set = new Set();
    const arr = {base: 0};

    try {
      for (let i = parseInt(BaseYear); i <= parseInt(LastYear); i++) {
        for (
          let j = i == BaseYear ? parseInt(BaseMonth) : 1;
          j <= (i == LastYear) ? parseInt(LastMonth) : 12;
          j++
        ) {
          if (j == 13) {
            break;
          }
          const curMonth =
            j < 10 ? `${i}-0${j}-01T00:00:00.00Z` : `${i}-${j}-01T00:00:00.00Z`;
          const nextMonth =
            j != 12
              ? j >= 9
                ? `${i}-${j + 1}-01T00:00:00.00Z`
                : `${i}-0${j + 1}-01T00:00:00.00Z`
              : `${i + 1}-${'01'}-01T00:00:00.00Z`;
          let count = 0;
          IssueInRange.forEach(issue => {
            if (
              Date.parse(curMonth) <= Date.parse(issue['updated_at']) &&
              Date.parse(nextMonth) >= Date.parse(issue['updated_at']) &&
              !set.has(issue.user_id)
            ) {
              count++;
              set.add(issue.user_id, true);
            }
          });
          let key;
          if (j < 10) {
            key = `${i}-0${j}-01`;
          } else {
            key = `${i}-${j}-01`;
          }
          arr[key] = arr[Object.keys(arr)[Object.keys(arr).length - 1]] + count;
        }
      }
    } catch (e) {
      console.log(e);
    }
    delete arr.base;
    return arr;
  } catch (e) {
    throw createCustomError(e, 500);
  }
};

const IssueUtil = {
  GetIssueInfo,
  GetRepoIssueUpdateFrequencyByYear,
  GetRepoIssueCreateFrequencyByYear,
  GetRepoIssueCloseFrequencyByYear,

  GetRepoIssueUpdateFrequencyByMonth,
  GetRepoIssueCreateFrequencyByMonth,
  GetRepoIssueCloseFrequencyByMonth,

  GetRepoIssueUpdateFrequencyByDay,
  GetRepoIssueCreateFrequencyByDay,
  GetRepoIssueCloseFrequencyByDay,

  GetIssuersCountInRange,
};
module.exports = IssueUtil;
