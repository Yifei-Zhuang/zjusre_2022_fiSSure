const IssueSchema = require('../models/issue');
const {Octokit} = require('@octokit/core');
const config = require('../config');
const {default: mongoose} = require('mongoose');
const {YearCounter, MonthCounter, DayCounter} = require('../utils/index');
const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN || config.GITHUB_ACCESS_TOKEN,
});
/**
 * @brief 获取指定仓库的issue记录（最多10000条）
 * @method post
 * @param {*} req
 * @param {*} res
 */
const GetIssueInfo = async (req, res) => {
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

      if (page_num > 60 || issueMessage.data.length == 0) {
        // 最多6000条
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
          issueObject.closed_at = issue.closed_at;
          await issueObject.save();
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
 * @brief 获取指定仓库的所有issue（debug使用）
 * @method post
 * @param {*} req
 * @param {*} res
 */
const GetAllIssueOfRepo = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const issues = await RepoIssueTimeFilter(owner, repo);
    res.status(200).json({
      issues,
    });
  } catch (e) {
    res.status(500).json({
      msg: 'fail',
      err: e,
    });
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
const GetRepoIssueUpdateFrequencyByYear = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const tail = req.body.tail;
    const begin = req.body.begin;
    if (!owner || !repo || !tail || !begin) {
      throw 'missing body data';
    }
    const IssueInRange = await RepoIssueTimeFilter(owner, repo, begin, tail);
    const arr = await YearCounter(IssueInRange, begin, tail, 'updated_at');
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
const GetRepoIssueCreateFrequencyByYear = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const tail = req.body.tail;
    const begin = req.body.begin;
    if (!owner || !repo || !tail || !begin) {
      throw 'missing body data';
    }
    const IssueInRange = await RepoIssueTimeFilter(owner, repo, begin, tail);
    const arr = await YearCounter(IssueInRange, begin, tail, 'created_at');
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
const GetRepoIssueCloseFrequencyByYear = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const tail = req.body.tail;
    const begin = req.body.begin;
    if (!owner || !repo || !tail || !begin) {
      throw 'missing body data';
    }
    const IssueInRange = await RepoIssueTimeFilter(owner, repo, begin, tail);
    const arr = await YearCounter(IssueInRange, begin, tail, 'closed_at');
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
const GetRepoIssueUpdateFrequencyByMonth = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const tail = req.body.tail;
    const begin = req.body.begin;
    if (!owner || !repo || !tail || !begin) {
      throw 'missing body data';
    }
    const IssueInRange = await RepoIssueTimeFilter(owner, repo, begin, tail);
    const arr = await MonthCounter(IssueInRange, begin, tail, 'updated_at');
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
const GetRepoIssueCreateFrequencyByMonth = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const tail = req.body.tail;
    const begin = req.body.begin;
    if (!owner || !repo || !tail || !begin) {
      throw 'missing body data';
    }
    const IssueInRange = await RepoIssueTimeFilter(owner, repo, begin, tail);
    const arr = await MonthCounter(IssueInRange, begin, tail, 'created_at');
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
const GetRepoIssueCloseFrequencyByMonth = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const tail = req.body.tail;
    const begin = req.body.begin;
    if (!owner || !repo || !tail || !begin) {
      throw 'missing body data';
    }
    const IssueInRange = await RepoIssueTimeFilter(owner, repo, begin, tail);
    const arr = await MonthCounter(IssueInRange, begin, tail, 'closed_at');
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
const GetRepoIssueUpdateFrequencyByDay = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const tail = req.body.tail;
    const begin = req.body.begin;
    if (!owner || !repo || !tail || !begin) {
      throw 'missing body data';
    }
    const IssueInRange = await RepoIssueTimeFilter(owner, repo, begin, tail);
    const arr = await DayCounter(IssueInRange, begin, tail, 'updated_at');
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
const GetRepoIssueCreateFrequencyByDay = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const tail = req.body.tail;
    const begin = req.body.begin;
    if (!owner || !repo || !tail || !begin) {
      throw 'missing body data';
    }
    const IssueInRange = await RepoIssueTimeFilter(owner, repo, begin, tail);
    const arr = await DayCounter(IssueInRange, begin, tail, 'created_at');
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
const GetRepoIssueCloseFrequencyByDay = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const tail = req.body.tail;
    const begin = req.body.begin;
    if (!owner || !repo || !tail || !begin) {
      throw 'missing body data';
    }
    const IssueInRange = await RepoIssueTimeFilter(owner, repo, begin, tail);
    const arr = await DayCounter(IssueInRange, begin, tail, 'closed_at');
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
const GetIssuersCountInRange = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const tail = req.body.tail;
    const begin = req.body.begin;
    if (!owner || !repo || !tail || !begin) {
      throw 'missing body data';
    }
    const IssueInRange = await RepoIssueTimeFilter(owner, repo, begin, tail);
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
 * @brief  获得从begin到tail时间段中的所有issue记录
 * @param {*} owner 仓库拥有者
 * @param {*} repo 仓库名
 * @param {*} begin 查询的开始时间，格式请参照 ‘2016-11-12’
 * @param {*} tail 查询的截止时间，格式请参照 ‘2016-11-12’
 */
const RepoIssueTimeFilter = async (
  owner,
  repo,
  begin = '1970-01-01',
  tail = '2023-01-01',
) => {
  const AllIssuesOfRepo = await IssueSchema.find({
    repo_owner: owner,
    repo_name: repo,
  });
  const FullBeginTime = begin + 'T00:00:00.000Z';
  const FullTailTime = tail + 'T00:00:00.000Z';

  AllIssuesOfRepo.filter(issue => {
    return (
      Date.parse(FullTailTime) >= Date.parse(issue.updated_at) &&
      Date.parse(FullBeginTime) <= Date.parse(issue.updated_at)
    );
  });
  if (AllIssuesOfRepo.length == 0) {
    return {2022: '0', 2021: '0', 2020: '0', 2019: '0'};
  }
  return AllIssuesOfRepo;
};

module.exports = {
  GetIssueInfo,
  GetAllIssueOfRepo,
  GetRepoIssueUpdateFrequencyByYear,
  GetRepoIssueCloseFrequencyByYear,
  GetRepoIssueCreateFrequencyByYear,
  GetRepoIssueUpdateFrequencyByMonth,
  GetRepoIssueCloseFrequencyByMonth,
  GetRepoIssueCreateFrequencyByMonth,
  GetRepoIssueUpdateFrequencyByDay,
  GetRepoIssueCloseFrequencyByDay,
  GetRepoIssueCreateFrequencyByDay,
  GetIssuersCountInRange,
};
