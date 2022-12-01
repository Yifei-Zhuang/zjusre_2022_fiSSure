const PullSchema = require('../models/pull');
const {Octokit} = require('@octokit/core');
const config = require('../config');
const {default: mongoose} = require('mongoose');
const {createCustomError} = require('../errors/custom-error');
const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN || config.GITHUB_ACCESS_TOKEN,
});

const {
  YearCounter,
  MonthCounter,
  DayCounter,
  AsyncFunctionWrapper,
  Sleep,
} = require('./index');
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
const AsyncFetchPullInfo = async (owner, repo) => {
  // 检查repo是否存在
  const repoResponse = await octokit.request('GET /repos/{owner}/{repo}', {
    owner: owner,
    repo: repo,
  });
  const per_page = 100;

  while (1) {
    const page_num = await GetPageNum();
    let pullMessage = null;
    try {
      pullMessage = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
        owner: owner,
        repo: repo,
        state: 'all',
        page: page_num,
        per_page: per_page,
        since: new Date(
          new Date().getTime() - 365 * 24 * 60 * 60 * 1000,
        ).toString(),
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
    if (pullMessage.data.length == 0 || page_num >= 300) {
      console.log(`fetch pull msg finish! total ${page_num} pages`);
      break;
    }

    for (const pull of pullMessage.data) {
      let pullObject;
      try {
        pullObject = await PullSchema.findOne({
          id: pull.id,
        });
      } catch (error) {
        console.log(error);
      }
      if (!pullObject) {
        // console.log(pull);
        // break;
        let newPull;

        newPull = {
          id: pull.id,
          url: pull.html_url,
          number: pull.number,
          state: pull.state,
          title: pull.title,
          isLocked: pull.locked,
          // 存储body等待时间非常长，所以这里先填一个空值
          body: pull.body ? pull.body : 'test',
          // body: ' ',
          created_at: pull.created_at,
          updated_at: pull.updated_at,
          closed_at: pull.closed_at ? pull.closed_at : undefined,
          merged_at: pull.merged_at ? pull.merged_at : undefined,
          is_merged: pull.merged_at != null,
          repos_id: repoResponse.data.id,
          user_id: pull.user.id,
          repo_owner: pull.html_url.split('/')[3],
          repo_name: pull.html_url.split('/')[4],
        };

        const CreatePull = await PullSchema.create(newPull);
        // await Sleep(1000);
      } else {
        pullObject.state = pull.state;
        isLocked: pull.locked;
        pullObject.body = pull.body ? pull.body : 'test';
        pullObject.title = pull.title;
        pullObject.updated_at = pull.updated_at;
        pullObject.closed_at = pull.updated_at;
        is_merged: pull.merged_at != null;
        await pullObject.save();
        // await Sleep(1000);
      }
    }
  }
};
/**
 * @brief 获取指定仓库的pull记录（最多10000条）
 * @method post
 * @param {*} owner
 * @param {*} repo
 */
const GetPullInfo = async (owner, repo) => {
  try {
    await AsyncFunctionWrapper(AsyncFetchPullInfo, owner, repo);
    console.log('pull fetch finish');
  } catch (err) {
    throw createCustomError(err, 500);
  } finally {
    PAGE_NUM = 0;
  }
};
/**
 * @brief 获取指定仓库的所有pull（debug使用）
 * @method post
 * @param {*} req
 * @param {*} res
 */
const GetAllPullOfRepo = async (owner, repo) => {
  try {
    return await PullSchema.find({
      repo_owner: owner,
      repo_name: repo,
    }).sort([['updated_at', 1]]);
  } catch (e) {
    throw createCustomError(e, 500);
  }
};
/**
 * @brief 获取指定年份之间的pull更新频率
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
const GetRepoPullUpdateFrequencyByYear = async (owner, repo) => {
  try {
    if (!owner || !repo) {
      throw 'missing body data';
    }

    const PullInRange = await PullSchema.find({
      repo_owner: owner,
      repo_name: repo,
    }).sort([['updated_at', 1]]);
    if (PullInRange.length == 0) {
      return {};
    }
    const begin = PullInRange[0].created_at;
    return await YearCounter(PullInRange, 'updated_at', begin);
  } catch (e) {
    throw createCustomError(e, 500);
  }
};
/**
 * @brief 获取指定年份之间的pull Close频率
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
const GetRepoPullCloseFrequencyByYear = async (owner, repo) => {
  try {
    if (!owner || !repo) {
      throw 'missing body data';
    }
    const PullInRange = await PullSchema.find({
      repo_owner: owner,
      repo_name: repo,
    }).sort([['closed_at', 1]]);
    if (PullInRange.length == 0) {
      return {};
    }
    const begin = PullInRange[0].created_at;

    return await YearCounter(PullInRange, 'closed_at', begin);
  } catch (e) {
    throw createCustomError(e, 500);
  }
};
/**
 * @brief 获取指定年份之间的pull create频率
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
const GetRepoPullCreateFrequencyByYear = async (owner, repo) => {
  try {
    if (!owner || !repo) {
      throw 'missing body data';
    }
    const PullInRange = await PullSchema.find({
      repo_owner: owner,
      repo_name: repo,
    }).sort([['created_at', 1]]);
    if (PullInRange.length == 0) {
      return {};
    }
    const begin = PullInRange[0].created_at;
    return await YearCounter(PullInRange, 'created_at', begin);
  } catch (e) {
    throw createCustomError(e, 500);
  }
};
/**
 * @brief 获取指定月份之间的pull update频率
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
const GetRepoPullUpdateFrequencyByMonth = async (owner, repo) => {
  try {
    if (!owner || !repo) {
      throw 'missing body data';
    }
    const PullInRange = await PullSchema.find({
      repo_owner: owner,
      repo_name: repo,
    }).sort([['updated_at', 1]]);
    if (PullInRange.length == 0) {
      return {};
    }
    const begin = PullInRange[0].created_at;

    return await MonthCounter(PullInRange, 'updated_at', begin);
  } catch (e) {
    throw createCustomError(e, 500);
  }
};
const GetRepoPullCloseFrequencyByMonth = async (owner, repo) => {
  try {
    if (!owner || !repo) {
      throw 'missing body data';
    }
    const PullInRange = await PullSchema.find({
      repo_owner: owner,
      repo_name: repo,
    }).sort([['closed_at', 1]]);
    if (PullInRange.length == 0) {
      return {};
    }
    const begin = PullInRange[0].created_at;

    return await MonthCounter(PullInRange, 'closed_at', begin);
  } catch (e) {
    throw createCustomError(e, 500);
  }
};
/**
 * @brief 获取指定月份之间的pull create频率
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
const GetRepoPullCreateFrequencyByMonth = async (owner, repo) => {
  try {
    if (!owner || !repo) {
      throw 'missing body data';
    }
    const PullInRange = await PullSchema.find({
      repo_owner: owner,
      repo_name: repo,
    }).sort([['created_at', 1]]);
    if (PullInRange.length == 0) {
      return {};
    }
    const begin = PullInRange[0].created_at;
    return await MonthCounter(PullInRange, 'created_at', begin);
  } catch (e) {
    throw createCustomError(e, 500);
  }
};
/**
 * @brief 获取指定日子之间的pull update频率
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
const GetRepoPullUpdateFrequencyByDay = async (owner, repo) => {
  try {
    if (!owner || !repo) {
      throw 'missing body data';
    }
    const PullInRange = await PullSchema.find({
      repo_owner: owner,
      repo_name: repo,
    }).sort([['updated_at', 1]]);
    if (PullInRange.length == 0) {
      return {};
    }
    const begin = PullInRange[0].created_at;
    return await DayCounter(PullInRange, 'updated_at', begin);
  } catch (e) {
    throw createCustomError(e, 500);
  }
};
/**
 * @brief 获取指定日子之间的pull close频率
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
const GetRepoPullCloseFrequencyByDay = async (owner, repo) => {
  try {
    if (!owner || !repo) {
      throw 'missing body data';
    }
    const PullInRange = await PullSchema.find({
      repo_owner: owner,
      repo_name: repo,
    }).sort([['closed_at', 1]]);
    if (PullInRange.length == 0) {
      return {};
    }
    const begin = PullInRange[0].created_at;
    return await DayCounter(PullInRange, 'closed_at', begin);
  } catch (e) {
    throw createCustomError(e, 500);
  }
};
/**
 * @brief 获取指定日子之间的pull create频率
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
const GetRepoPullCreateFrequencyByDay = async (owner, repo) => {
  try {
    if (!owner || !repo) {
      throw 'missing body data';
    }
    const PullInRange = await PullSchema.find({
      repo_owner: owner,
      repo_name: repo,
    }).sort([['created_at', 1]]);
    if (PullInRange.length == 0) {
      return {};
    }
    const begin = PullInRange[0].created_at;
    return await DayCounter(PullInRange, 'created_at', begin);
  } catch (e) {
    throw createCustomError(e, 500);
  }
};
/**
 * @brief 获取指定日子之间的累计pullers数量
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
const GetPullersCountInRange = async (owner, repo) => {
  try {
    if (!owner || !repo) {
      throw 'missing body data';
    }
    const PullInRange = await GetAllPullOfRepo(owner, repo);
    if (PullInRange.length == 0) {
      return {};
    }
    const begin = PullInRange[0].created_at;
    const BaseYear = begin ? begin.split('-')[0] : '2008';
    const BaseMonth = begin ? begin.split('-')[1] : '3';
    const LastYear = new Date().getUTCFullYear();
    const LastMonth = new Date().toISOString().split('-')[1];
    const set = new Set();
    const arr = {base: 0};
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
        PullInRange.forEach(pull => {
          if (
            Date.parse(curMonth) <= Date.parse(pull['updated_at']) &&
            Date.parse(nextMonth) >= Date.parse(pull['updated_at']) &&
            !set.has(pull.user_id)
          ) {
            count++;
            set.add(pull.user_id, true);
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
    delete arr.base;
    return arr;
  } catch (e) {
    throw createCustomError(e, 500);
  }
};
const PullUtil = {
  GetPullInfo,
  GetAllPullOfRepo,
  GetRepoPullUpdateFrequencyByYear,
  GetRepoPullCloseFrequencyByYear,
  GetRepoPullCreateFrequencyByYear,
  GetRepoPullUpdateFrequencyByMonth,
  GetRepoPullCloseFrequencyByMonth,
  GetRepoPullCreateFrequencyByMonth,
  GetRepoPullUpdateFrequencyByDay,
  GetRepoPullCloseFrequencyByDay,
  GetRepoPullCreateFrequencyByDay,
  GetPullersCountInRange,
};
module.exports = PullUtil;
