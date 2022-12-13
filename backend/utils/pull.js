const PullSchema = require('../models/pull');
const PullYearCreateCacheSchema = require('../models/pull-year-create-cache')
const PullYearUpdateCacheSchema = require('../models/pull-year-update-cache')
const PullYearCloseCacheSchema = require('../models/pull-year-close-cache')
const PullMonthUpdateSchema = require('../models/pull-month-update')
const PullerCacheSchema = require('../models/pullers-cache')
const PullMonthCloseCacheSchema = require('../models/pull-month-close-cache')
const PullMonthCreateCacheSchema = require('../models/pull-month-create-cache')
const { Octokit } = require('@octokit/core');
const config = require('../config');
const { default: mongoose } = require('mongoose');
const { createCustomError } = require('../errors/custom-error');
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
const AsyncFetchPullInfo = async (owner, repo) => {
  // 检查repo是否存在
  const repoResponse = await octokit.request('GET /repos/{owner}/{repo}', {
    owner: owner,
    repo: repo,
  });
  const per_page = 100;

  while (1) {
    const page_num = await GetPageNum();
    if (page_num >= UPDATE_THRESHOLD) {
      console.log(`fetch issue msg finish! total ${page_num} pages`);
      break;
    }
    let pullMessage = null;
    try {
      console.log(page_num)
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
          labels: pull.labels.map(item => item.name),
        };

        const CreatePull = await PullSchema.create(newPull);
        // await Sleep(1000);
      } else {
        pullObject.state = pull.state;
        pullObject.isLocked = pull.locked;
        pullObject.body = pull.body ? pull.body : 'test';
        pullObject.title = pull.title;
        pullObject.updated_at = pull.updated_at;
        pullObject.closed_at = pull.updated_at;
        pullObject.is_merged = pull.merged_at != null;
        pullObject.labels = pull.labels.map(item => item.name);
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
    console.log(new Date(), 'begin GetRepoPullCreateFrequencyByYear')
    if (!owner || !repo) {
      throw 'missing body data';
    }
    let map = new Map();
    const cache = await PullYearCreateCacheSchema.findOne({
      repo_owner: owner,
      repo_name: repo
    })
    let maxYear = '1970-01-01';
    if (cache) {
      for (const key in cache.pull_year_create_frequency) {
        maxYear = maxYear > key ? maxYear : key;
        map.set(key, cache.pull_year_create_frequency[key]);
      }
    }
    const PullInRange = await PullSchema.find({
      repo_owner: owner,
      repo_name: repo,
      updated_at: { $gt: maxYear }
    }).sort([['created_at', 1]]);
    if (PullInRange.length == 0) {
      return {};
    }
    const begin = PullInRange[0].created_at;
    let result = await YearCounter(PullInRange, 'created_at', begin, null, map);
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
      if (!(cache.pull_year_create_frequency)) {
        cache.pull_year_create_frequency = {};
      }
      // 更新计算结果
      Object.assign(cache.pull_year_create_frequency, temp);
      cache.save();
    } else {
      PullYearCreateCacheSchema.create({
        pull_year_create_frequency: temp,
        repo_owner: owner,
        repo_name: repo,
      });
    }
    console.log(new Date(), 'end GetRepoPullCreateFrequencyByYear')
    return { ...(cache ? cache?.pull_year_create_frequency : {}), ...result };
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
    console.log(new Date(), 'start GetRepoPullUpdateFrequencyByYear');
    if (!owner || !repo) {
      throw 'missing body data';
    }
    let map = new Map();
    const cache = await PullYearUpdateCacheSchema.findOne({
      repo_owner: owner,
      repo_name: repo
    })
    let maxYear = '1970-01-01';
    if (cache) {
      for (const key in cache.pull_year_update_frequency) {
        maxYear = maxYear > key ? maxYear : key;
        map.set(key, cache.pull_year_update_frequency[key]);
      }
    }
    const PullInRange = await PullSchema.find({
      repo_owner: owner,
      repo_name: repo,
      updated_at: { $gt: maxYear }
    }).sort([['updated_at', 1]]);
    if (PullInRange.length == 0) {
      return {};
    }
    const begin = PullInRange[0].created_at;
    let result = await YearCounter(PullInRange, 'updated_at', begin, null, map);
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
      if (!(cache.pull_year_update_frequency)) {
        cache.pull_year_update_frequency = {};
      }
      // 更新计算结果
      Object.assign(cache.pull_year_update_frequency, temp);
      cache.save();
    } else {
      PullYearUpdateCacheSchema.create({
        pull_year_update_frequency: temp,
        repo_owner: owner,
        repo_name: repo,
      });
    }
    console.log(new Date(), 'end GetRepoPullUpdateFrequencyByYear');
    return { ...(cache ? cache?.pull_year_update_frequency : {}), ...result };
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
    console.log(new Date(), 'start GetRepoPullCloseFrequencyByYear');
    if (!owner || !repo) {
      throw 'missing body data';
    }
    let map = new Map();
    const cache = await PullYearCloseCacheSchema.findOne({
      repo_owner: owner,
      repo_name: repo
    })
    let maxYear = '1970-01-01';
    if (cache) {
      for (const key in cache.pull_year_close_frequency) {
        maxYear = maxYear > key ? maxYear : key;
        map.set(key, cache.pull_year_close_frequency[key]);
      }
    }
    const PullInRange = await PullSchema.find({
      repo_owner: owner,
      repo_name: repo,
      closed_at: { $exists: true, $ne: null, $gt: maxYear }
    }).sort([['closed_at', 1]]);
    if (PullInRange.length == 0) {
      return {};
    }
    const begin = PullInRange[0].created_at;

    let result = await YearCounter(PullInRange, 'closed_at', begin, null, map);
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
      if (!(cache.pull_year_close_frequency)) {
        cache.pull_year_close_frequency = {};
      }
      // 更新计算结果
      Object.assign(cache.pull_year_close_frequency, temp);
      cache.save();
    } else {
      PullYearCloseCacheSchema.create({
        pull_year_close_frequency: temp,
        repo_owner: owner,
        repo_name: repo,
      });
    }
    console.log(new Date(), 'end GetRepoPullCloseFrequencyByYear');
    return { ...(cache ? cache.pull_year_close_frequency : {}), ...result };
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
    console.log(new Date(), 'begin GetRepoPullUpdateFrequencyByMonth')
    if (!owner || !repo) {
      throw 'missing body data';
    }
    let map = new Map();
    const cache = await PullMonthUpdateSchema.findOne({
      repo_owner: owner,
      repo_name: repo
    })
    let maxMonth = '1970-01-01';
    if (cache) {
      for (const key in cache.pull_month_update_frequency) {
        maxMonth = maxMonth > key ? maxYear : key;
        map.set(key, cache.pull_month_update_frequency[key]);
      }
    }
    const PullInRange = await PullSchema.find({
      repo_owner: owner,
      repo_name: repo,
      updated_at: { $gt: maxMonth }
    }).sort([['updated_at', 1]]);
    if (PullInRange.length == 0) {
      return {};
    }
    const begin = PullInRange[0].created_at;
    let result = await MonthCounter(PullInRange, 'updated_at', begin, null, map);
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
      if (!cache.pull_month_update_frequency) {
        cache.pull_month_update_frequency = {};
      }
      // 更新计算结果
      Object.assign(cache.pull_month_update_frequency, temp);
      cache.save();
    } else {
      PullMonthUpdateSchema.create({
        pull_month_update_frequency: temp,
        repo_owner: owner,
        repo_name: repo,
      });
    }
    console.log(new Date(), 'end GetRepoPullUpdateFrequencyByMonth')
    return { ...(cache ? cache?.pull_month_update_frequency : {}), ...result };
  } catch (e) {
    throw createCustomError(e, 500);
  }
};
const GetRepoPullCloseFrequencyByMonth = async (owner, repo) => {
  try {
    console.log(new Date(), 'begin GetRepoPullCloseFrequencyByMonth')
    if (!owner || !repo) {
      throw 'missing body data';
    };
    let map = new Map();
    const cache = await PullMonthCloseCacheSchema.findOne({
      repo_owner: owner,
      repo_name: repo
    })
    let maxMonth = '1970-01-01';
    if (cache) {
      for (const key in cache.pull_month_close_frequency) {
        maxMonth = maxMonth > key ? maxYear : key;
        map.set(key, cache.pull_month_close_frequency[key]);
      }
    }

    const PullInRange = await PullSchema.find({
      repo_owner: owner,
      repo_name: repo,
      closed_at: { $exists: true, $ne: null, $gt: maxMonth }
    }).sort([['closed_at', 1]]);
    if (PullInRange.length == 0) {
      return {};
    }
    const begin = PullInRange[0].closed_at;

    let result = await MonthCounter(PullInRange, 'closed_at', begin, null, map);
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
      if (!cache.pull_month_close_frequency) {
        cache.pull_month_close_frequency = {};
      }
      // 更新计算结果
      Object.assign(cache.pull_month_close_frequency, temp);
      cache.save();
    } else {
      PullMonthCloseCacheSchema.create({
        pull_month_close_frequency: temp,
        repo_owner: owner,
        repo_name: repo,
      });
    }
    console.log(new Date(), 'end GetRepoPullCloseFrequencyByMonth')
    return { ...(cache ? cache?.pull_month_close_frequency : {}), ...result };
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
    console.log(new Date(), 'begin GetRepoPullCreateFrequencyByMonth')
    if (!owner || !repo) {
      throw 'missing body data';
    }
    let map = new Map();
    const cache = await PullMonthCreateCacheSchema.findOne({
      repo_owner: owner,
      repo_name: repo
    })
    let maxMonth = '1970-01-01';
    if (cache) {
      for (const key in cache.pull_month_create_frequency) {
        maxMonth = maxMonth > key ? maxYear : key;
        map.set(key, cache.pull_month_create_frequency[key]);
      }
    }
    const PullInRange = await PullSchema.find({
      repo_owner: owner,
      repo_name: repo,
      created_at: { $gt: maxMonth }
    }).sort([['created_at', 1]]);
    if (PullInRange.length == 0) {
      return {};
    }
    const begin = PullInRange[0].created_at;
    let result = await MonthCounter(PullInRange, 'created_at', begin, null, map);
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
      if (!cache.pull_month_create_frequency) {
        cache.pull_month_create_frequency = {};
      }
      // 更新计算结果
      Object.assign(cache.pull_month_create_frequency, temp);
      cache.save();
    } else {
      PullMonthCreateCacheSchema.create({
        pull_month_create_frequency: temp,
        repo_owner: owner,
        repo_name: repo,
      });
    }
    console.log(new Date(), 'end GetRepoPullCreateFrequencyByMonth')
    return { ...(cache ? cache?.pull_month_create_frequency : {}), ...result };
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
    console.log(new Date(), 'begin GetPullersCountInRange')
    if (!owner || !repo) {
      throw 'missing body data';
    }
    let cache = await PullerCacheSchema.findOne({
      repo_owner: owner,
      repo_name: repo
    })
    let arr = { base: 0 };
    if (cache) {
      arr = { ...arr, ...cache?.puller_count }
    }
    let maxMonth =
      Object.keys(arr).at(-1) === 'base'
        ? '2011-01-01'
        : Object.keys(arr).at(-1);
    const PullInRange = await PullSchema.find({
      repo_owner: owner,
      repo_name: repo,
      created_at: { $gt: maxMonth }
    }).sort([['created_at', 1]])
    if (PullInRange.length == 0) {
      return {};
    }
    const begin = PullInRange[0].created_at;
    const BaseYear = begin ? begin.split('-')[0] : '2008';
    const BaseMonth = begin ? begin.split('-')[1] : '3';
    const LastYear = new Date().getUTCFullYear();
    const LastMonth = new Date().toISOString().split('-')[1];
    const set = new Set();

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
            Date.parse(curMonth) <= Date.parse(pull['created_at']) &&
            Date.parse(nextMonth) >= Date.parse(pull['created_at']) &&
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
    let copy = arr;
    let lastMonth = Object.keys(copy).at(-1)
    delete copy[lastMonth]
    if (cache) {
      cache.puller_count = copy;
      cache.save();
    } else {
      PullerCacheSchema.create({
        puller_count: copy,
        repo_name: repo,
        repo_owner: owner
      })
    }
    console.log(new Date(), 'end GetPullersCountInRange')
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
