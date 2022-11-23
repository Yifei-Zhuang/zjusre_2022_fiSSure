const CommitSchema = require('../models/commit');
const {Octokit} = require('@octokit/core');
const config = require('../config');
const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN || config.GITHUB_ACCESS_TOKEN,
});
const {createCustomError} = require('../errors/custom-error');

const {YearCounter, MonthCounter, DayCounter} = require('./index');
/**
 * @brief 获取指定仓库的所有commit（debug使用）
 * @method post
 * @param {*} owner 仓库拥有者
 * @param {*} repo 仓库名称
 *
 */
const GetCommitInfo = async (owner, repo) => {
  try {
    // 检查repo是否存在
    const repoResponse = await octokit.request('GET /repos/{owner}/{repo}', {
      owner: owner,
      repo: repo,
    });
    let page_num = 1;
    const per_page = 100;

    while (1) {
      const commitMessage = await octokit.request(
        'GET /repos/{owner}/{repo}/commits',
        {
          owner: owner,
          repo: repo,
          page: page_num,
          per_page: per_page,
        },
      );

      if (page_num > 250 || commitMessage.data.length == 0) {
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
          } catch (e) {
            console.log(e);
          }
        } else {
        }
      }
      page_num++;
    }
  } catch (err) {
    throw createCustomError(err, 500);
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

    const CommitInRange = await CommitSchema.find({
      repo_owner: owner,
      repo_name: repo,
    }).sort([['updated_at', 1]]);
    const begin = CommitInRange[0].updated_at;
    return await YearCounter(CommitInRange, 'updated_at', begin);
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
    const CommitInRange = await CommitSchema.find({
      repo_owner: owner,
      repo_name: repo,
    }).sort([['updated_at', 1]]);
    const begin = CommitInRange[0].updated_at;
    return await MonthCounter(CommitInRange, 'updated_at', begin);
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
    const CommitInRange = await CommitSchema.find({
      repo_owner: owner,
      repo_name: repo,
    }).sort([['updated_at', 1]]);
    const begin = CommitInRange[0].updated_at;
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
        CommitInRange.forEach(commit => {
          if (
            Date.parse(curMonth) <= Date.parse(commit['updated_at']) &&
            Date.parse(nextMonth) >= Date.parse(commit['updated_at']) &&
            !set.has(commit.author_name)
          ) {
            count++;
            set.add(commit.author_name, true);
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

const CommitUtil = {
  GetCommitInfo,
  GetRepoCommitFrequencyByYear,
  GetRepoCommitFrequencyByMonth,
  GetRepoCommitFrequencyByDay,
  GetCommitersCountInRange,
};
module.exports = CommitUtil;
