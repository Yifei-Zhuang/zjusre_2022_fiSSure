const asyncWrapper = require('../middleware/async');
const {createCustomError} = require('../errors/custom-error');
const RepoSchema = require('../models/repo');
const ObjectId = require('mongodb').ObjectId;
const dotenv = require('dotenv');
const {Octokit} = require('@octokit/core');
const res = require('express/lib/response');
const config = require('../config');
const CommitSchema = require('../models/commit');
const IssueSchema = require('../models/issue');
const CommitUtil = require('../utils/commit');
const IssueUtil = require('../utils/issue');
const PullUtil = require('../utils/pull');
const IssueCommentUtil = require('../utils/issueComment');
const pull = require('../models/pull');
const {GetCoreContributorByYear1} = require('../utils/CoreContributor');
const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN || config.GITHUB_ACCESS_TOKEN,
});

dotenv.config('../env');
const GetMessage = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repoName;
    const repoMessage = await octokit
      .request('GET /repos/{owner}/{repo}', {
        owner: req.body.owner,
        repo: req.body.repoName,
      })
      .catch(err => {
        console.log(err);
      });

    //      获取仓库的commit，issue，pull信息
    await CommitUtil.GetCommitInfo(owner, repo);

    await IssueUtil.GetIssueInfo(owner, repo);
    try {
      await PullUtil.GetPullInfo(owner, repo);
    } catch (e) {
      console.log(`dont't mind this`, e);
    }
    console.log('fetch metadata finish');
    let commit_frequency;

    let issue_frequency;

    let contributors;

    let recent_released_at;

    let language;
    await Promise.all([
      (async () => {
        commit_frequency = await RepoGetCommitFrequency(
          repoMessage.data.owner.login,
          repoMessage.data.name,
        );
      })(),
      (async () => {
        issue_frequency = await RepoGetIssueFrequency(
          repoMessage.data.owner.login,
          repoMessage.data.name,
        );
      })(),
      (async () => {
        contributors = await RepoGetContributors(
          repoMessage.data.owner.login,
          repoMessage.data.name,
        );
      })(),
      (async () => {
        recent_released_at = await RepoGetReleaseTime(
          repoMessage.data.owner.login,
          repoMessage.data.name,
        );
      })(),
      (async () => {
        language = await RepoGetLanguage(
          repoMessage.data.owner.login,
          repoMessage.data.name,
        );
      })(),
    ]);
    try {
      const CreateRepo = await RepoSchema.create({
        name: repoMessage.data.name,
        owner: repoMessage.data.owner.login,
        uploader: req.body.user,
        forks: repoMessage.data.forks,
        stars: repoMessage.data.watchers,
        open_issues: repoMessage.data.open_issues,
        commit_frequency: commit_frequency,
        issue_frequency: issue_frequency,
        contributors: contributors,
        timeline: {
          created_at: repoMessage.data.created_at,
          updated_at: repoMessage.data.updated_at,
          pushed_at: repoMessage.data.pushed_at,
          recent_released_at: recent_released_at,
        },
        language: language,
      });
    } catch (e) {
      console.log(e);
      throw e;
    }

    res.status(201).json({status: 'success!'});
  } catch (err) {
    res.status(404).json(err);
  }
};

const SearchRepoName = async (req, res) => {
  try {
    const SearchKey = req.body.search.trim();
    if (SearchKey == '') {
      var search = await RepoSchema.find({});
    } else
      search = await RepoSchema.find({
        name: {$regex: SearchKey, $options: '$i'},
      });
    var repos = [];
    for (var i in search) {
      var eachRepo = {
        _id: search[i]._id.toString(),
        name: search[i].name,
        owner: search[i].owner,
        stars: search[i].stars,
        uploader: search[i].uploader,
        uploaded_time: search[i]._id.getTimestamp(),
      };
      repos.push(eachRepo);
    }
    console.log(repos);
    return res.status(201).json({repos});
  } catch (err) {
    res.status(404).json(err);
  }
};

const GetDashboard = async (req, res) => {
  try {
    let getDayS = req.body.getDay ? true : false;
    let detail;
    try {
      detail = await RepoSchema.findOne({_id: ObjectId(req.body.id)});
    } catch (e) {
      console.log('detail fetch error');
      throw e;
    }
    try {
      let owner = detail.owner;
      let repo = detail.name;
      let commit_frequency;
      let pull_frequency;
      let issue_frequency;
      let issue_comment_frequency;
      console.log(new Date(), 'compute commit begin');
      await Promise.all([
        (async () => {
          try {
            commit_frequency = {
              commit_year_frequency:
                await CommitUtil.GetRepoCommitFrequencyByYear(owner, repo),
              commit_month_frequency:
                await CommitUtil.GetRepoCommitFrequencyByMonth(owner, repo),
              commit_day_frequency: getDayS
                ? await CommitUtil.GetRepoCommitFrequencyByDay(owner, repo)
                : {},
              commiter_count: await CommitUtil.GetCommitersCountInRange(
                owner,
                repo,
              ),
            };
          } catch (e) {
            console.log('commit fetch error');
            throw e;
          }
        })(),
      ]);
      console.log(new Date(), 'compute commit finish');
      console.log(new Date(), 'compute pull begin');
      await (async () => {
        try {
          pull_frequency = {
            pull_year_create_frequency:
              await PullUtil.GetRepoPullCreateFrequencyByYear(owner, repo),
            pull_year_close_frequency:
              await PullUtil.GetRepoPullCloseFrequencyByYear(owner, repo),
            pull_year_update_frequency:
              await PullUtil.GetRepoPullUpdateFrequencyByYear(owner, repo),
            pull_month_create_frequency:
              await PullUtil.GetRepoPullCreateFrequencyByMonth(owner, repo),
            pull_month_close_frequency:
              await PullUtil.GetRepoPullCloseFrequencyByMonth(owner, repo),
            pull_month_update_frequency:
              await PullUtil.GetRepoPullUpdateFrequencyByMonth(owner, repo),
            pull_day_create_frequency: getDayS
              ? await PullUtil.GetRepoPullCreateFrequencyByDay(owner, repo)
              : {},
            pull_day_close_frequency: getDayS
              ? await PullUtil.GetRepoPullCloseFrequencyByDay(owner, repo)
              : {},
            pull_day_update_frequency: getDayS
              ? await PullUtil.GetRepoPullUpdateFrequencyByDay(owner, repo)
              : {},
            puller_count: await PullUtil.GetPullersCountInRange(owner, repo),
          };
        } catch (e) {
          console.log('pull fetch error');
          throw e;
        }
      })();
      console.log(new Date(), 'compute pull finish');
      console.log(new Date(), 'compute issue begin');
      await (async () => {
        try {
          issue_frequency = {
            issue_year_create_frequency:
              await IssueUtil.GetRepoIssueCreateFrequencyByYear(owner, repo),
            Issue_year_update_frequency:
              await IssueUtil.GetRepoIssueUpdateFrequencyByYear(owner, repo),
            Issue_year_close_frequency:
              await IssueUtil.GetRepoIssueCloseFrequencyByYear(owner, repo),
            Issue_month_create_frequency:
              await IssueUtil.GetRepoIssueCreateFrequencyByMonth(owner, repo),
            Issue_month_update_frequency:
              await IssueUtil.GetRepoIssueUpdateFrequencyByMonth(owner, repo),
            Issue_month_close_frequency:
              await IssueUtil.GetRepoIssueCloseFrequencyByMonth(owner, repo),
            Issue_day_create_frequency: getDayS
              ? await IssueUtil.GetRepoIssueCreateFrequencyByDay(owner, repo)
              : {},
            Issue_day_update_frequency: getDayS
              ? await IssueUtil.GetRepoIssueUpdateFrequencyByDay(owner, repo)
              : {},
            Issue_day_close_frequency: getDayS
              ? await IssueUtil.GetRepoIssueCloseFrequencyByDay(owner, repo)
              : {},
            Issuer_count: await IssueUtil.GetIssuersCountInRange(owner, repo),
          };
        } catch (e) {
          console.log('issue fetch error');
          throw e;
        }
      })();
      console.log(new Date(), 'compute issue finish');
      console.log(new Date(), 'compute comment begin');
      await (async () => {
        issue_comment_frequency = {
          monthly_count: await IssueCommentUtil.getIssueCloseTime(owner, repo),
          response_time: await IssueCommentUtil.getFirstResponseTimeMap(
            owner,
            repo,
          ),
        };
        console.log(new Date(), 'compute comment finish');
      })();
      console.log(new Date(), 'compute comment begin');
      console.log(new Date(), 'compute coreContributorByYear begin');
      let coreContributorByYear = await GetCoreContributorByYear1(owner, repo);
      console.log(new Date(), 'compute coreContributorByYear finish');

      try {
        detail = {
          ...detail._doc,
          ...commit_frequency,
          ...pull_frequency,
          ...issue_frequency,
          ...issue_comment_frequency,
          coreContributorByYear,
        };
        res.status(201).json(detail);
      } catch (e) {
        console.log(e);
        throw e;
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  } catch (err) {
    res.status(404).json(err);
  }
};

const DeleteRepo = async (req, res) => {
  try {
    const test = await RepoSchema.deleteOne({_id: ObjectId(req.body.id)});
    res.status(201).json({msg: 'success!'});
  } catch (err) {
    res.status(404).json(err);
  }
};

const RepoGetCommitFrequency = async (owner, name) => {
  const repoMessage = {
    data: [
      ...(await CommitSchema.find({
        repo_owner: owner,
        repo_name: name,
      })
        .sort([['updated_at', -1]])
        .limit(50)),
    ],
  };

  const x1 = repoMessage.data[0].updated_at;
  const x2 = repoMessage.data[repoMessage.data.length - 1].updated_at;
  const t1 = TransDate(x1);
  const t2 = TransDate(x2);
  var frequency = {};

  if (t1 - t2 < 2) {
    frequency = CountDayCommit(repoMessage);
  } else if (t1 - t2 > 15) {
    year1 = Math.floor(t1 / 12);
    year2 = Math.floor(t2 / 12);
    frequency = CountYearCommit(year1, year2, repoMessage.data);
  } else {
    frequency = CountMonthCommit(t1, t2, repoMessage.data);
  }
  return frequency;
};

const CountDayCommit = Msg => {
  var order = {};
  var result = {};

  for (var i in Msg.data) {
    var t = Msg.data[i].updated_at.substring(0, 10);
    formalLength = Object.keys(order).length;
    if (!(t in result)) {
      order[formalLength.toString()] = t;
      result[t] = 1;
    } else {
      result[t] += 1;
    }
  }
  var pra = Math.floor((Object.keys(order).length - 1) / 6) + 1;
  var answer = {};
  var a = Math.floor(Object.keys(order).length / pra);
  if (pra == 1) {
    for (var i = 0; i < a; i++) {
      answer[order[i.toString()]] = result[order[i.toString()]];
    }
    return answer;
  }
  for (var i = 0; i < a; i++) {
    pp = order[i * pra];
    var sum = 0;
    for (var j = i * pra; j <= i * pra + pra - 1; j++) {
      sum += result[order[j.toString()]];
    }
    answer[pp] = sum;
  }
  return answer;
};

const RepoGetIssueFrequency = async (owner, name) => {
  const repoMessage = {
    data: [
      ...(await IssueSchema.find({
        owner_name: owner,
        repo_name: name,
      })
        .sort([['created_at', -1]])
        .limit(50)),
    ],
  };
  if (!repoMessage.data || repoMessage.data.length == 0) {
    return 0;
  }
  const x1 = repoMessage.data[0].created_at;
  const x2 = repoMessage.data[repoMessage.data.length - 1].created_at;
  const t1 = TransDate(x1);
  const t2 = TransDate(x2);

  var frequency = {};
  if (t1 - t2 < 2) {
    frequency = CountDayIssue(repoMessage);
  } else if (t1 - t2 > 15) {
    year1 = Math.floor(t1 / 12);
    year2 = Math.floor(t2 / 12);
    frequency = CountYearIssue(year1, year2, repoMessage.data);
  } else {
    frequency = CountMonthIssue(t1, t2, repoMessage.data);
  }
  return frequency;
};

const CountDayIssue = Msg => {
  var order = {};
  var result = {};

  for (var i in Msg.data) {
    var t = Msg.data[i].created_at.substring(0, 10);
    formalLength = Object.keys(order).length;
    if (!(t in result)) {
      order[formalLength.toString()] = t;
      result[t] = 1;
    } else {
      result[t] += 1;
    }
  }
  var pra = Math.floor((Object.keys(order).length - 1) / 6) + 1;
  var answer = {};
  var a = Math.floor(Object.keys(order).length / pra);
  if (pra == 1) {
    for (var i = 0; i < a; i++) {
      answer[order[i.toString()]] = result[order[i.toString()]];
    }
    return answer;
  }
  for (var i = 0; i < a; i++) {
    pp = order[i * pra];
    var sum = 0;
    for (var j = i * pra; j <= i * pra + pra - 1; j++) {
      sum += result[order[j.toString()]];
    }
    answer[pp] = sum;
  }
  return answer;
};

const TransDate = date => {
  year = date.substring(0, 4);
  month = date.substring(5, 7);
  year1 = parseInt(year, 10);
  month1 = parseInt(month, 10);
  return (year1 - 2000) * 12 + month1 - 1;
};

const CountYearCommit = (year1, year2, commitmsg) => {
  var countNum = new Array(year1 - year2 + 1).fill(0);
  commitmsg.map(x => {
    year0 = Math.floor(TransDate(x.updated_at) / 12);
    countNum[year1 - year0] += 1;
  });

  var obj = {};
  for (var i = year1; i >= year2; i--) {
    nn = i + 2000;
    cc = nn + '';
    obj[cc] = countNum[year1 - i];
  }
  return obj;
};

const CountYearIssue = (year1, year2, commitmsg) => {
  var countNum = new Array(year1 - year2 + 1).fill(0);
  commitmsg.map(x => {
    year0 = Math.floor(TransDate(x.created_at) / 12);
    countNum[year1 - year0] += 1;
  });
  var obj = {};
  for (var i = year1; i >= year2; i--) {
    nn = i + 2000;
    cc = nn + '';
    obj[cc] = countNum[year1 - i];
  }
  return obj;
};

const CountMonthCommit = (t1, t2, commitmsg) => {
  var countNum = new Array(t1 - t2 + 1).fill(0);
  commitmsg.map(x => {
    t = TransDate(x.updated_at);
    countNum[t1 - t] += 1;
  });

  var obj = {};
  for (var i = t1; i >= t2; i--) {
    mm = (i % 12) + 1;
    nn = (i - mm + 1) / 12 + 2000;
    cc = mm > 9 ? nn + '-' + mm : nn + '-0' + mm;
    obj[cc] = countNum[t1 - i];
  }
  return obj;
};

const CountMonthIssue = (t1, t2, commitmsg) => {
  var countNum = new Array(t1 - t2 + 1).fill(0);
  commitmsg.map(x => {
    t = TransDate(x.created_at);
    countNum[t1 - t] += 1;
  });

  var obj = {};
  for (var i = t1; i >= t2; i--) {
    mm = (i % 12) + 1;
    nn = (i - mm + 1) / 12 + 2000;
    cc = mm > 9 ? nn + '-' + mm : nn + '-0' + mm;
    obj[cc] = countNum[t1 - i];
  }
  return obj;
};

const RepoGetContributors = async (owner, name) => {
  const repoMessage = await octokit.request(
    'GET /repos/{owner}/{repo}/contributors',
    {
      owner: owner,
      repo: name,
    },
  );

  var result = [];
  for (
    var i = 0;
    i < (repoMessage.data.length < 5 ? repoMessage.data.length : 5);
    i++
  ) {
    const userMessage = await octokit.request('GET /users/{username}', {
      username: repoMessage.data[i].login,
    });
    var ss = {
      name: repoMessage.data[i].login,
      avatar_url: repoMessage.data[i].avatar_url,
      contributions: repoMessage.data[i].contributions,
      company: userMessage.data.company,
      public_repos: userMessage.data.public_repos,
      public_gists: userMessage.data.public_gists,
      followers: userMessage.data.followers,
      created_at: userMessage.data.created_at,
    };
    result.push(ss);
  }
  return result;
};

const RepoGetReleaseTime = async (owner, name) => {
  const repoMessage = await octokit.request(
    'GET /repos/{owner}/{repo}/releases',
    {
      owner: owner,
      repo: name,
    },
  );
  if (!repoMessage.data.length) return 'not published yet!';
  return repoMessage.data[0].published_at;
};

const RepoGetLanguage = async (owner, name) => {
  const repoMessage = await octokit.request(
    'GET /repos/{owner}/{repo}/languages',
    {
      owner: owner,
      repo: name,
    },
  );
  return repoMessage.data;
};

module.exports = {
  GetMessage,
  SearchRepoName,
  GetDashboard,
  DeleteRepo,
};
