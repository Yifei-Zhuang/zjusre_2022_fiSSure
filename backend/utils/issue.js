const IssueSchema = require('../models/issue');
const { Octokit } = require('@octokit/core');
const config = require('../config');
const IssueYearUpdateCacheSchema = require('../models/issue-year-update-cache')
const IssueYearCreateCacheSchema = require('../models/issue-year-create-cache')
const IssueYearCloseCacheSchema = require('../models/issue-year-close-cache')
const IssueMonthUpdateCacheSchema = require('../models/issue-month-update-cache')
const IssueMonthCreateCacheSchema = require('../models/issue-month-create-cache')
const IssueMonthCloseCacheSchema = require('../models/issue-month-close-cache')
const IssuersCacheSchema = require('../models/issuers-cache')
const { default: mongoose } = require('mongoose');
const {
  YearCounter,
  MonthCounter,
  DayCounter,
  AsyncFunctionWrapper,
} = require('./index');
const { createCustomError } = require('../errors/custom-error');
const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN || config.GITHUB_ACCESS_TOKEN,
});
const { Mutex } = require('async-mutex');

let PageMutex = new Mutex();
// 最终交付的时候，只搜索最近20000条
const UPDATE_THRESHOLD = 200;
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
    if (page_num >= UPDATE_THRESHOLD) {
      console.log(`fetch issue msg finish! total ${page_num} pages`);
      break;
    }
    const per_page = 100;
    let issueMessage = null;
    try {
      issueMessage = await octokit.request('GET /repos/{owner}/{repo}/issues', {
        owner: owner,
        repo: repo,
        state: 'all',
        page: page_num,
        per_page: 100,
        since: new Date(
          new Date().getTime() - 365 * 24 * 60 * 60 * 1000,
        ).toString(),
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
    // if (page_num > 600 || issueMessage.data.length == 0) {
    if (issueMessage.data.length == 0) {
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
            labels: issue.labels.map(item => item.name),
          };
          const CreateIssue = await IssueSchema.create(newIssue);
        } catch (e) {
          console.log(e);
        }
      } else {
        issueObject.state = issue.state;
        issueObject.updated_at = issue.updated_at;
        issueObject.closed_at = issue.closed_at ? issue.closed_at : undefined;
        issueObject.labels = issue.labels.map(item => item.name);
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
    console.log(new Date(), 'begin GetRepoIssueUpdateFrequencyByYear')
    if (!owner || !repo) {
      throw 'missing body data';
    }
    let map = new Map();
    const cache = await IssueYearUpdateCacheSchema.findOne({
      repo_owner: owner,
      repo_name: repo
    })
    let maxYear = '1970-01-01';
    if (cache) {
      for (const key in cache.issue_year_update_frequency) {
        maxYear = maxYear > key ? maxYear : key;
        map.set(key, cache.issue_year_update_frequency[key]);
      }
    }
    const IssueInRange = await IssueSchema.find({
      repo_owner: owner,
      repo_name: repo,
      created_at: { $gt: maxYear }
    }).sort([['created_at', 1]]);
    if (IssueInRange.length == 0) {
      return {};
    }
    const begin = IssueInRange[0].created_at;
    let result = await YearCounter(IssueInRange, 'updated_at', begin, null, map);
    let temp = {};
    // 去掉最后一年
    const curYear = `${new Date().getUTCFullYear()}-01-01`;
    for (const key in result) {
      if (key === curYear) {
        continue;
      }
      temp[key] = result[key];
    }
    if (cache) {
      if (!(cache.issue_year_update_frequency)) {
        cache.issue_year_update_frequency = {};
      }
      // 更新计算结果
      Object.assign(cache.issue_year_update_frequency, temp);
      cache.save();
    } else {
      IssueYearUpdateCacheSchema.create({
        issue_year_update_frequency: temp,
        repo_owner: owner,
        repo_name: repo,
      });
    }
    console.log(new Date(), 'end GetRepoIssueUpdateFrequencyByYear')
    return { ...(cache ? cache?.issue_year_update_frequency : {}), ...result };
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
    console.log(new Date(), 'begin GetRepoIssueCreateFrequencyByYear')
    if (!owner || !repo) {
      throw 'missing body data';
    }
    let map = new Map();
    const cache = await IssueYearCreateCacheSchema.findOne({
      repo_owner: owner,
      repo_name: repo
    })
    let maxYear = '1970-01-01';
    if (cache) {
      for (const key in cache.issue_year_create_frequency) {
        maxYear = maxYear > key ? maxYear : key;
        map.set(key, cache.issue_year_create_frequency[key]);
      }
    }

    const IssueInRange = await IssueSchema.find({
      repo_owner: owner,
      repo_name: repo,
      created_at: { $gt: maxYear }
    }).sort([['created_at', 1]]);
    if (IssueInRange.length == 0) {
      return {};
    }
    const begin = IssueInRange[0].created_at;
    let result = await YearCounter(IssueInRange, 'created_at', begin, null, map);
    // 去掉最后一年
    let temp = {};
    const curYear = `${new Date().getUTCFullYear()}-01-01`;
    for (const key in result) {
      if (key === curYear) {
        continue;
      }
      temp[key] = result[key];
    }
    if (cache) {
      if (!(cache.issue_year_create_frequency)) {
        cache.issue_year_create_frequency = {};
      }
      // 更新计算结果
      Object.assign(cache.issue_year_create_frequency, temp);
      cache.save();
    } else {
      IssueYearCreateCacheSchema.create({
        issue_year_create_frequency: temp,
        repo_owner: owner,
        repo_name: repo,
      });
    }
    return { ...(cache ? cache?.issue_year_create_frequency : {}), ...result };
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
    console.log(new Date(), 'start GetRepoIssueCloseFrequencyByYear');

    if (!owner || !repo) {
      throw 'missing body data';
    }
    let map = new Map();
    const cache = await IssueYearCloseCacheSchema.findOne({
      repo_owner: owner,
      repo_name: repo
    })
    let maxYear = '1970-01-01';
    if (cache) {
      for (const key in cache.issue_year_close_frequency) {
        maxYear = maxYear > key ? maxYear : key;
        map.set(key, cache.issue_year_close_frequency[key]);
      }
    }

    const IssueInRange = await IssueSchema.find({
      repo_owner: owner,
      repo_name: repo,
      closed_at: { $exists: true, $ne: null, $gt: maxYear }
    }).sort([['closed_at', 1]]);
    if (IssueInRange.length == 0) {
      return {};
    }
    const begin = IssueInRange[0].created_at;
    let result = await YearCounter(IssueInRange, 'closed_at', begin, null, map);
    let temp = {};
    // 去掉最后一年
    const curYear = `${new Date().getUTCFullYear()}-01-01`;
    for (const key in result) {
      if (key === curYear) {
        continue;
      }
      temp[key] = result[key];
    }
    if (cache) {
      if (!(cache.issue_year_close_frequency)) {
        cache.issue_year_close_frequency = {};
      }
      // 更新计算结果
      Object.assign(cache.issue_year_close_frequency, temp);
      cache.save();
    } else {
      IssueYearCloseCacheSchema.create({
        issue_year_close_frequency: temp,
        repo_owner: owner,
        repo_name: repo,
      });
    }
    console.log(new Date(), 'end GetRepoIssueCloseFrequencyByYear');
    return { ...(cache ? cache.issue_year_close_frequency : {}), ...result };
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
    console.log(new Date(), 'begin GetRepoIssueUpdateFrequencyByMonth')
    if (!owner || !repo) {
      throw 'missing body data';
    }
    let map = new Map();
    const cache = await IssueMonthUpdateCacheSchema.findOne({
      repo_owner: owner,
      repo_name: repo
    })
    let maxMonth = '1970-01-01';
    if (cache) {
      for (const key in cache.issue_month_update_frequency) {
        maxMonth = maxMonth > key ? maxYear : key;
        map.set(key, cache.issue_month_update_frequency[key]);
      }
    }
    const IssueInRange = await IssueSchema.find({
      repo_owner: owner,
      repo_name: repo,
      created_at: { $gt: maxMonth }
    }).sort([['updated_at', 1]]);
    if (IssueInRange.length == 0) {
      return {};
    }
    const begin = IssueInRange[0].created_at;
    let result = await MonthCounter(IssueInRange, 'updated_at', begin, null, map);
    // 存储计算结果
    let temp = {};
    // 去掉最后一年
    const curMonth = `${new Date().getUTCFullYear()}-${new Date().toISOString().split('-')[1]
      }-01`;
    for (const key in result) {
      if (key === curMonth) {
        continue;
      }
      temp[key] = result[key];
    }
    if (cache) {
      if (!cache.issue_month_update_frequency) {
        cache.issue_month_update_frequency = {};
      }
      // 更新计算结果
      Object.assign(cache.issue_month_update_frequency, temp);
      cache.save();
    } else {
      IssueMonthUpdateCacheSchema.create({
        issue_month_update_frequency: temp,
        repo_owner: owner,
        repo_name: repo,
      });
    }
    console.log(new Date(), 'begin GetRepoIssueUpdateFrequencyByMonth')
    return { ...(cache ? cache?.issue_month_update_frequency : {}), ...result };
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
    console.log(new Date(), 'begin GetRepoIssueCreateFrequencyByMonth')

    if (!owner || !repo) {
      throw 'missing body data';
    }
    let map = new Map();
    const cache = await IssueMonthCreateCacheSchema.findOne({
      repo_owner: owner,
      repo_name: repo
    })
    let maxMonth = '1970-01-01';
    if (cache) {
      for (const key in cache.issue_month_create_frequency) {
        maxMonth = maxMonth > key ? maxYear : key;
        map.set(key, cache.issue_month_create_frequency[key]);
      }
    }

    const IssueInRange = await IssueSchema.find({
      repo_owner: owner,
      repo_name: repo,
      created_at: { $gt: maxMonth }
    }).sort([['created_at', 1]]);
    if (IssueInRange.length == 0) {
      return {};
    }
    const begin = IssueInRange[0].created_at;
    let result = await MonthCounter(IssueInRange, 'created_at', begin, null, map);
    // 存储计算结果
    let temp = {};
    // 去掉最后一年
    const curMonth = `${new Date().getUTCFullYear()}-${new Date().toISOString().split('-')[1]
      }-01`;
    for (const key in result) {
      if (key === curMonth) {
        continue;
      }
      temp[key] = result[key];
    }
    if (cache) {
      if (!cache.issue_month_create_frequency) {
        cache.issue_month_create_frequency = {};
      }
      // 更新计算结果
      Object.assign(cache.issue_month_create_frequency, temp);
      cache.save();
    } else {
      IssueMonthCreateCacheSchema.create({
        issue_month_create_frequency: temp,
        repo_owner: owner,
        repo_name: repo,
      });
    }
    console.log(new Date(), 'end GetRepoIssueCreateFrequencyByMonth')
    return { ...(cache ? cache?.issue_month_create_frequency : {}), ...result };
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
    console.log(new Date(), 'begin GetRepoIssueCloseFrequencyByMonth')
    if (!owner || !repo) {
      throw 'missing body data';
    }
    let map = new Map();
    const cache = await IssueMonthCloseCacheSchema.findOne({
      repo_owner: owner,
      repo_name: repo
    })
    let maxMonth = '1970-01-01';
    if (cache) {
      for (const key in cache.issue_month_close_frequency) {
        maxMonth = maxMonth > key ? maxYear : key;
        map.set(key, cache.issue_month_close_frequency[key]);
      }
    }
    const IssueInRange = await IssueSchema.find({
      repo_owner: owner,
      repo_name: repo,
      closed_at: { $exists: true, $ne: null, $gt: maxMonth }
    }).sort([['closed_at', 1]]);
    if (IssueInRange.length == 0) {
      return {};
    }
    const begin = IssueInRange[0].created_at;
    let result = await MonthCounter(IssueInRange, 'closed_at', begin, null, map);
    let temp = {};
    // 去掉最后一年
    const curMonth = `${new Date().getUTCFullYear()}-${new Date().toISOString().split('-')[1]
      }-01`;
    for (const key in result) {
      if (key === curMonth) {
        continue;
      }
      temp[key] = result[key];
    }
    if (cache) {
      if (!cache.issue_month_close_frequency) {
        cache.issue_month_close_frequency = {};
      }
      // 更新计算结果
      Object.assign(cache.issue_month_close_frequency, temp);
      cache.save();
    } else {
      IssueMonthCloseCacheSchema.create({
        issue_month_close_frequency: temp,
        repo_owner: owner,
        repo_name: repo,
      });
    }
    console.log(new Date(), 'end GetRepoIssueCloseFrequencyByMonth')
    return { ...(cache ? cache?.issue_month_close_frequency : {}), ...result };
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
    if (IssueInRange.length == 0) {
      return {};
    }
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
    if (IssueInRange.length == 0) {
      return {};
    }
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
    if (IssueInRange.length == 0) {
      return {};
    }
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
    console.log(new Date(), 'begin GetIssuersCountInRange')
    if (!owner || !repo) {
      throw 'missing body data';
    }
    let cache = await IssuersCacheSchema.findOne({
      repo_owner: owner,
      repo_name: repo
    })
    let arr = { base: 0 };
    if (cache) {
      arr = { ...arr, ...cache?.issuer_count }
    }
    let maxMonth =
      Object.keys(arr).at(-1) === 'base'
        ? '2011-01-01'
        : Object.keys(arr).at(-1);
    const IssueInRange = await IssueSchema.find({
      repo_owner: owner,
      repo_name: repo,
      created_at: { $gt: maxMonth }
    }).sort([['created_at', 1]]);
    if (IssueInRange.length == 0) {
      return {};
    }
    const begin = IssueInRange[0].created_at;
    const BaseYear = begin ? begin.split('-')[0] : '2008';
    const BaseMonth = begin ? begin.split('-')[1] : '3';
    const LastYear = new Date().getUTCFullYear();
    const LastMonth = new Date().toISOString().split('-')[1];
    const set = new Set();

    let pre = 0;
    try {
      for (
        let i = parseInt(BaseYear);
        i <= parseInt(LastYear) && pre < IssueInRange.length;
        i++
      ) {
        for (
          let j = i == BaseYear ? parseInt(BaseMonth) : 1;
          j <= (i == LastYear) ? parseInt(LastMonth) : 12;
          j++
        ) {
          if (j == 13) {
            break;
          }
          let curMonth =
            j < 10 ? `${i}-0${j}-01T00:00:00.00Z` : `${i}-${j}-01T00:00:00.00Z`;
          let nextMonth =
            j != 12
              ? j >= 9
                ? `${i}-${j + 1}-01T00:00:00.00Z`
                : `${i}-0${j + 1}-01T00:00:00.00Z`
              : `${i + 1}-${'01'}-01T00:00:00.00Z`;
          curMonth = Date.parse(curMonth);
          nextMonth = Date.parse(nextMonth);

          let count = 0;
          for (let x = pre; x < IssueInRange.length; x++) {
            const issue = IssueInRange[x];
            if (
              issue['created_at'] &&
              curMonth <= Date.parse(issue['created_at']) &&
              nextMonth >= Date.parse(issue['created_at']) &&
              !set.has(issue.user_id)
            ) {
              count++;
              pre++;
              set.add(issue.user_id, true);
            } else if (nextMonth < Date.parse(issue['created_at'])) {
              pre = x;
              break;
            }
          }

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
    let copy = arr;
    let lastMonth = Object.keys(copy).at(-1)
    delete copy[lastMonth]
    if (cache) {
      cache.issuer_count = copy;
      cache.save();
    } else {
      IssuersCacheSchema.create({
        issuer_count: copy,
        repo_name: repo,
        repo_owner: owner
      })
    }
    console.log(new Date(), 'end GetIssuersCountInRange')
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
