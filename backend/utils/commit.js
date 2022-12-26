const CommitSchema = require('../models/commit');
const CommitYearSchema = require('../models/commit-year-cache');
const CommitMonthSchema = require('../models/commit-month-cache');
const CommiterCacheSchema = require('../models/commiter-cache');

const { Octokit } = require('@octokit/core');
const config = require('../config');
const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN || config.GITHUB_ACCESS_TOKEN,
});
const { createCustomError } = require('../errors/custom-error');
const { Mutex } = require('async-mutex');
const {
  YearCounter,
  MonthCounter,
  DayCounter,
  AsyncFunctionWrapper,
} = require('./index');

let PageMutex = new Mutex();
let PAGE_NUM = 0;
const GetPageNum = async () => {
  let release = await PageMutex.acquire();
  let returnVal = PAGE_NUM;
  PAGE_NUM++;
  release();
  return returnVal;
};

const AsyncFetchCommitInfo = async (owner, repo) => {
  const per_page = 100;
  const repoResponse = await octokit.request('GET /repos/{owner}/{repo}', {
    owner: owner,
    repo: repo,
  });
  while (1) {
    const page_num = await GetPageNum();

    let commitMessage = null;
    try {
      commitMessage = await octokit.request(
        'GET /repos/{owner}/{repo}/commits',
        {
          owner: owner,
          repo: repo,
          page: page_num,
          per_page: per_page,
        },
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
    // if (page_num > 250 || commitMessage.data.length == 0) {
    if (commitMessage.data.length == 0) {
      // 最多10000条
      console.log(`fetch commit msg finish! total ${page_num} pages`);
      break;
    }

    for (const commit of commitMessage.data) {
      let commitObject;
      try {
        commitObject = await CommitSchema.findOne({
          sha: commit.sha,
        });
      } catch (error) {
        console.log(error);
      }
      if (!commitObject) {
        let name = commit.author
          ? commit.author.login
          : commit.commit.author
            ? commit.commit.author.name
            : 'test';
        try {
          const newCommit = {
            sha: commit.sha,
            url: commit.html_url,
            author_id: commit.author ? commit.author.id : undefined,
            author_name: name,
            author_email: commit.commit.author
              ? commit.commit.author.email
              : '',
            updated_at: commit.commit.author
              ? commit.commit.author.date
              : '2020-12-20T17:44:07Z',
            message: commit.commit.message,
            repos_id: repoResponse.data.id,
            repo_owner: commit.html_url.split('/')[3],
            repo_name: commit.html_url.split('/')[4],
          };
          const CreateCommit = await CommitSchema.create(newCommit);
          //避免github检测
        } catch (e) {
          console.log(e);
        }
      } else {
        return;
      }
    }
  }
};
/**
 * @brief 获取指定仓库的所有commit（debug使用）
 * @method post
 * @param {*} owner 仓库拥有者
 * @param {*} repo 仓库名称
 *
 */
const GetCommitInfo = async (owner, repo) => {
  try {
    await Promise.all([
      AsyncFetchCommitInfo(owner, repo),
      AsyncFetchCommitInfo(owner, repo),
      AsyncFetchCommitInfo(owner, repo),
      AsyncFetchCommitInfo(owner, repo),
      AsyncFetchCommitInfo(owner, repo),
      AsyncFetchCommitInfo(owner, repo),
      AsyncFetchCommitInfo(owner, repo),
      AsyncFetchCommitInfo(owner, repo),
      AsyncFetchCommitInfo(owner, repo),
      AsyncFetchCommitInfo(owner, repo),
      AsyncFetchCommitInfo(owner, repo),
    ]);
    console.log('commit fetch finish');
  } catch (err) {
    throw createCustomError(err, 500);
  } finally {
    PAGE_NUM = 0;
  }
};
/**
 * @brief 获取指定年份之间的commit频率
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
const GetRepoCommitFrequencyByYear = async (owner, repo) => {
  try {
    if (!owner || !repo) {
      throw 'missing body data';
    }
    let map = new Map();
    const CommitYearCache = await CommitYearSchema.findOne({
      repo_owner: owner,
      repo_name: repo,
    });
    let maxYear = '1970-01-01';
    if (CommitYearCache) {
      for (const key in CommitYearCache.commit_year_frequency) {
        maxYear = maxYear > key ? maxYear : key;
        map.set(key, CommitYearCache.commit_year_frequency[key]);
      }
    }
    // 升序排列
    const CommitInRange = await CommitSchema.find({
      repo_owner: owner,
      repo_name: repo,
      updated_at: { $gt: maxYear },
    }).sort([['updated_at', 1]]);
    if (CommitInRange.length == 0) {
      return {};
    }
    const begin = CommitInRange[0].updated_at;
    // result不会有cache中已有的结果
    let result = await YearCounter(
      CommitInRange,
      'updated_at',
      begin,
      null,
      map,
    );
    // 存储计算结果

    let temp = {};
    // 去掉最后一年
    const curYear = `${new Date().getUTCFullYear()}-01-01`;
    for (const key in result) {
      if (key === curYear) {
        continue;
      }
      temp[key] = result[key];
    }
    if (CommitYearCache) {
      if (!CommitYearCache.commit_year_frequency) {
        CommitYearCache.commit_year_frequency = {};
      }
      // 更新计算结果
      Object.assign(CommitYearCache.commit_year_frequency, temp);
      CommitYearCache.save();
    } else {
      CommitYearSchema.create({
        commit_year_frequency: temp,
        repo_owner: owner,
        repo_name: repo,
      });
    }
    return { ...CommitYearCache?.commit_year_frequency, ...result };
  } catch (e) {
    throw createCustomError(e, 400);
  }
};
/**
 * @brief 获取指定月份之间的commit频率
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
const GetRepoCommitFrequencyByMonth = async (owner, repo) => {
  try {
    if (!owner || !repo) {
      throw 'missing body data';
    }

    let map = new Map();
    const CommitMonthCache = await CommitMonthSchema.findOne({
      repo_owner: owner,
      repo_name: repo,
    });
    let maxMonth = '2016-01-01';
    if (CommitMonthCache) {
      for (const key in CommitMonthCache.commit_month_frequency) {
        maxMonth = maxMonth > key ? maxMonth : key;
        map.set(key, CommitMonthCache.commit_month_frequency[key]);
      }
    }
    const CommitInRange = await CommitSchema.find({
      repo_owner: owner,
      repo_name: repo,
      updated_at: { $gt: maxMonth },
    }).sort([['updated_at', 1]]);
    if (CommitInRange.length == 0) {
      return {};
    }
    const begin = CommitInRange[0].updated_at;

    let result = await MonthCounter(
      CommitInRange,
      'updated_at',
      begin,
      null,
      map,
    );
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
    if (CommitMonthCache) {
      Object.assign(CommitMonthCache.commit_month_frequency, temp);
      // 更新计算结果
      await CommitMonthCache.save();
    } else {
      await CommitMonthSchema.create({
        commit_month_frequency: temp,
        repo_owner: owner,
        repo_name: repo,
      });
    }
    return { ...CommitMonthCache?.commit_month_frequency, ...result };
  } catch (e) {
    throw createCustomError(e, 500);
  }
};
/**
 * @brief 获取指定日子之间的commit频率
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
const GetRepoCommitFrequencyByDay = async (owner, repo) => {
  try {
    if (!owner || !repo) {
      throw 'missing body data';
    }
    const CommitInRange = await CommitSchema.find({
      repo_owner: owner,
      repo_name: repo,
    }).sort([['updated_at', 1]]);
    if (CommitInRange.length == 0) {
      return {};
    }
    const begin = CommitInRange[0].updated_at;
    return await DayCounter(CommitInRange, 'updated_at', begin);
  } catch (e) {
    throw createCustomError(e, 500);
  }
};
/**
 * @brief 获取指定日子之间的累计commiters数量
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
const GetCommitersCountInRange = async (owner, repo) => {
  try {
    if (!owner || !repo) {
      throw 'missing body data';
    }
    let cache = await CommiterCacheSchema.findOne({
      repo_owner: owner,
      repo_name: repo,
    });
    let arr = { base: 0 };
    if (cache) {
      arr = { ...arr, ...cache.commiter_count };
    } else {
    }
    let maxMonth =
      Object.keys(arr).at(-1) === 'base'
        ? '2011-01-01'
        : Object.keys(arr).at(-1);
    const CommitInRange = await CommitSchema.find({
      repo_owner: owner,
      repo_name: repo,
      updated_at: { $gt: maxMonth },
    }).sort([['updated_at', 1]]);
    if (CommitInRange.length == 0) {
      return {};
    }
    const begin = CommitInRange[0].updated_at;
    const BaseYear = begin ? begin.split('-')[0] : '2008';
    const BaseMonth = begin ? begin.split('-')[1] : '3';
    const LastYear = new Date().getUTCFullYear();
    const LastMonth = new Date().toISOString().split('-')[1];
    const set = new Set();

    let pre = 0;
    for (
      let i = parseInt(BaseYear);
      i <= parseInt(LastYear) && pre < CommitInRange.length;
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
        for (let x = pre; x < CommitInRange.length; x++) {
          const commit = CommitInRange[x];
          if (
            commit['updated_at'] &&
            curMonth <= Date.parse(commit['updated_at']) &&
            nextMonth >= Date.parse(commit['updated_at']) &&
            !set.has(commit.author_name)
          ) {
            count++;
            pre++;
            set.add(commit.author_name, true);
          } else if (nextMonth < Date.parse(commit['updated_at'])) {
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
        if (!arr[key])
          arr[key] = arr[Object.keys(arr)[Object.keys(arr).length - 1]] + count;
      }
    }
    delete arr.base;
    let copy = arr;
    let lastMonth = Object.keys(copy).at(-1);
    delete copy[lastMonth];
    if (cache) {
      cache.commiter_count = copy;
      await cache.save();
    } else {
      await CommiterCacheSchema.create({
        commiter_count: copy,
        repo_name: repo,
        repo_owner: owner,
      });
    }
    return arr;
  } catch (e) {
    throw createCustomError(e, 500);
  }
};

const CommitUtil = {
  GetCommitInfo,
  GetRepoCommitFrequencyByYear,
  GetRepoCommitFrequencyByMonth,
  GetRepoCommitFrequencyByDay,
  GetCommitersCountInRange,
};
module.exports = CommitUtil;
