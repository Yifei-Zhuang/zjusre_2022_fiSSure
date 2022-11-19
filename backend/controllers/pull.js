const PullSchema = require('../models/pull');
const {Octokit} = require('@octokit/core');
const config = require('../config');
const {default: mongoose} = require('mongoose');
const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN || config.GITHUB_ACCESS_TOKEN,
});
const {YearCounter, MonthCounter, DayCounter} = require('../utils/index');
/**
 * @brief 获取指定仓库的pull记录（最多10000条）
 * @method post
 * @param {*} req
 * @param {*} res
 */
const GetPullInfo = async (req, res) => {
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
      const pullMessage = await octokit.request(
        'GET /repos/{owner}/{repo}/pulls',
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
      if (page_num > 100 || pullMessage.data.length == 0) {
        // 最多10000条
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
          try {
            // console.log(pull);
            // break;
            const newPull = {
              id: pull.id,
              url: pull.html_url,
              number: pull.number,
              state: pull.state,
              title: pull.title,
              isLocked: pull.locked,
              body: pull.body ? pull.body : 'test',
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
          } catch (e) {
            console.log(e);
          }
        } else {
          pullObject.state = pull.state;
          pullObject.isLocked = pull.isLocked;
          pullObject.body = pull.body ? pull.body : 'test';
          pullObject.title = pull.title;
          pullObject.updated_at = pull.updated_at;
          pullObject.closed_at = pull.updated_at;
          pullObject.is_merged = pull.is_merged;
          await pullObject.save();
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
 * @brief 获取指定仓库的所有pull（debug使用）
 * @method post
 * @param {*} req
 * @param {*} res
 */
const GetAllPullOfRepo = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const pulls = await RepoPullTimeFilter(owner, repo);
    res.status(200).json({
      pulls,
    });
  } catch (e) {
    res.status(500).json({
      msg: 'fail',
      err: e,
    });
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
const GetRepoPullUpdateFrequencyByYear = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const tail = req.body.tail;
    const begin = req.body.begin;
    if (!owner || !repo || !tail || !begin) {
      throw 'missing body data';
    }
    const PullInRange = await RepoPullTimeFilter(owner, repo, begin, tail);
    const arr = await YearCounter(PullInRange, begin, tail, 'updated_at');
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
const GetRepoPullCloseFrequencyByYear = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const tail = req.body.tail;
    const begin = req.body.begin;
    if (!owner || !repo || !tail || !begin) {
      throw 'missing body data';
    }
    const PullInRange = await RepoPullTimeFilter(owner, repo, begin, tail);
    const arr = await YearCounter(PullInRange, begin, tail, 'closed_at');
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
const GetRepoPullCreateFrequencyByYear = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const tail = req.body.tail;
    const begin = req.body.begin;
    if (!owner || !repo || !tail || !begin) {
      throw 'missing body data';
    }
    const PullInRange = await RepoPullTimeFilter(owner, repo, begin, tail);
    const arr = await YearCounter(PullInRange, begin, tail, 'created_at');
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
const GetRepoPullUpdateFrequencyByMonth = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const tail = req.body.tail;
    const begin = req.body.begin;
    if (!owner || !repo || !tail || !begin) {
      throw 'missing body data';
    }
    const PullInRange = await RepoPullTimeFilter(owner, repo, begin, tail);
    const arr = await MonthCounter(PullInRange, begin, tail, 'updated_at');
    res.status(200).json({
      arr,
    });
  } catch (e) {
    res.status(400).json({
      e,
    });
  }
};
const GetRepoPullCloseFrequencyByMonth = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const tail = req.body.tail;
    const begin = req.body.begin;
    if (!owner || !repo || !tail || !begin) {
      throw 'missing body data';
    }
    const PullInRange = await RepoPullTimeFilter(owner, repo, begin, tail);
    const arr = await MonthCounter(PullInRange, begin, tail, 'closed_at');
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
const GetRepoPullCreateFrequencyByMonth = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const tail = req.body.tail;
    const begin = req.body.begin;
    if (!owner || !repo || !tail || !begin) {
      throw 'missing body data';
    }
    const PullInRange = await RepoPullTimeFilter(owner, repo, begin, tail);
    const arr = await MonthCounter(PullInRange, begin, tail, 'created_at');
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
const GetRepoPullUpdateFrequencyByDay = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const tail = req.body.tail;
    const begin = req.body.begin;
    if (!owner || !repo || !tail || !begin) {
      throw 'missing body data';
    }
    const PullInRange = await RepoPullTimeFilter(owner, repo, begin, tail);
    const arr = await DayCounter(PullInRange, begin, tail, 'updated_at');
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
const GetRepoPullCloseFrequencyByDay = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const tail = req.body.tail;
    const begin = req.body.begin;
    if (!owner || !repo || !tail || !begin) {
      throw 'missing body data';
    }
    const PullInRange = await RepoPullTimeFilter(owner, repo, begin, tail);
    const arr = await DayCounter(PullInRange, begin, tail, 'closed_at');
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
const GetRepoPullCreateFrequencyByDay = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const tail = req.body.tail;
    const begin = req.body.begin;
    if (!owner || !repo || !tail || !begin) {
      throw 'missing body data';
    }
    const PullInRange = await RepoPullTimeFilter(owner, repo, begin, tail);
    const arr = await DayCounter(PullInRange, begin, tail, 'created_at');
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
 * @brief  获得从begin到tail时间段中的所有commit记录
 * @param {*} owner 仓库拥有者
 * @param {*} repo 仓库名
 * @param {*} begin 查询的开始时间，格式请参照 ‘2016-11-12’
 * @param {*} tail 查询的截止时间，格式请参照 ‘2016-11-12’
 */
const RepoPullTimeFilter = async (
  owner,
  repo,
  begin = '1970-01-01',
  tail = '2023-01-01',
) => {
  const AllPullsOfRepo = await PullSchema.find({
    repo_owner: owner,
    repo_name: repo,
  });
  const FullBeginTime = begin + 'T00:00:00.000Z';
  const FullTailTime = tail + 'T00:00:00.000Z';

  AllPullsOfRepo.filter(pull => {
    return (
      Date.parse(FullTailTime) >= Date.parse(pull.updated_at) &&
      Date.parse(FullBeginTime) <= Date.parse(pull.updated_at)
    );
  });
  if (AllPullsOfRepo.length == 0) {
    return {2022: '0', 2021: '0', 2020: '0', 2019: '0'};
  }
  return AllPullsOfRepo;
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
const GetPullersCountInRange = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    const tail = req.body.tail;
    const begin = req.body.begin;
    if (!owner || !repo || !tail || !begin) {
      throw 'missing body data';
    }
    const PullInRange = await RepoPullTimeFilter(owner, repo, begin, tail);
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
module.exports = {
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
