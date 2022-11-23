const CommitSchema = require('../models/commit');
const {Octokit} = require('@octokit/core');
const config = require('../config');
const {default: mongoose} = require('mongoose');
const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN || config.GITHUB_ACCESS_TOKEN,
});
const {YearCounter, MonthCounter, DayCounter} = require('../utils/index');
/**
 * @brief 获取指定仓库的commit记录（最多10000条）
 * @method post
 * @param {*} req
 * @param {*} res
 */
const GetCommitInfo = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
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

      if (page_num > 100 || commitMessage.data.length == 0) {
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
    res.status(200).json({
      msg: 'success',
    });
  } catch (err) {
    res.status(500).json({
      msg: 'fail',
      err: err,
    });
  }
};
/**
 * @brief 获取指定仓库的所有commit（debug使用）
 * @method post
 * @param {*} req
 * @param {*} res
 */
const GetAllCommitsOfRepo = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const commits = await RepoCommitTimeFilter(owner, repo);
    res.status(200).json({
      commits,
    });
  } catch (e) {
    res.status(500).json({
      msg: 'fail',
      err: e,
    });
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
const GetRepoCommitFrequencyByYear = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const tail = req.body.tail;
    const begin = req.body.begin;
    if (!owner || !repo || !tail || !begin) {
      throw 'missing body data';
    }
    const CommitInRange = await RepoCommitTimeFilter(owner, repo, begin, tail);
    const arr = await YearCounter(CommitInRange, begin, tail, 'updated_at');
    res.status(200).json({
      arr,
    });
  } catch (e) {
    res.status(400).json({
      e,
    });
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
const GetRepoCommitFrequencyByMonth = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const tail = req.body.tail;
    const begin = req.body.begin;
    if (!owner || !repo || !tail || !begin) {
      throw 'missing body data';
    }
    const CommitInRange = await RepoCommitTimeFilter(owner, repo, begin, tail);

    const arr = await MonthCounter(CommitInRange, 'updated_at', begin, tail);

    res.status(200).json({
      arr,
    });
  } catch (e) {
    res.status(400).json({
      e,
    });
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
const GetRepoCommitFrequencyByDay = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const tail = req.body.tail;
    const begin = req.body.begin;
    if (!owner || !repo || !tail || !begin) {
      throw 'missing body data';
    }
    const CommitInRange = await RepoCommitTimeFilter(owner, repo, begin, tail);
    const arr = await DayCounter(CommitInRange, begin, tail, 'updated_at');
    res.status(200).json({
      arr,
    });
  } catch (e) {
    res.status(400).json({
      e,
    });
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
const GetCommitersCountInRange = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const tail = req.body.tail;
    const begin = req.body.begin;
    if (!owner || !repo || !tail || !begin) {
      throw 'missing body data';
    }
    const CommitInRange = await RepoCommitTimeFilter(owner, repo, begin, tail);
    const BaseYear = begin.split('-')[0];
    const BaseMonth = begin.split('-')[1];
    const LastYear = tail.split('-')[0];
    const LastMonth = tail.split('-')[1];
    const set = new Set();
    const arr = [
      {
        count: 0,
      },
    ];
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
        arr.push({
          year: i,
          month: j,
          count: arr.at(-1).count + count,
        });
      }
    }
    arr.shift();
    res.status(200).json(arr);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      e,
    });
  }
};
/**
 * @brief  获得从begin到tail时间段中的所有commit记录
 * @param {*} owner 仓库拥有者
 * @param {*} repo 仓库名
 * @param {*} begin 查询的开始时间，格式请参照 ‘2016-11-12’
 * @param {*} tail 查询的截止时间，格式请参照 ‘2016-11-12’
 */
const RepoCommitTimeFilter = async (
  owner,
  repo,
  begin = '1970-01-01',
  tail = '2023-01-01',
) => {
  let AllCommitsOfRepo = await CommitSchema.find({
    repo_owner: owner,
    repo_name: repo,
  });
  const FullBeginTime = begin + 'T00:00:00.000Z';
  const FullTailTime = tail + 'T00:00:00.000Z';

  AllCommitsOfRepo = AllCommitsOfRepo.filter(commit => {
    return (
      Date.parse(FullTailTime) >= Date.parse(commit.updated_at) &&
      Date.parse(FullBeginTime) <= Date.parse(commit.updated_at)
    );
  });
  if (AllCommitsOfRepo.length == 0) {
    return {2022: '0', 2021: '0', 2020: '0', 2019: '0'};
  }
  return AllCommitsOfRepo;
};
module.exports = {
  GetCommitInfo,
  GetAllCommitsOfRepo,
  GetRepoCommitFrequencyByYear,
  GetRepoCommitFrequencyByMonth,
  GetRepoCommitFrequencyByDay,
  GetCommitersCountInRange,
  RepoCommitTimeFilter,
};
