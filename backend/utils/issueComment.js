const IssueCommentSchema = require('../models/issue-comment');
const IssueSchema = require('../models/issue');
const issueCommentsCacheSchema = require('../models/issue-comment-cache');
const config = require('../config');
const {default: mongoose} = require('mongoose');
const {Octokit} = require('@octokit/core');
const {Mutex} = require('async-mutex');
const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN || config.GITHUB_ACCESS_TOKEN,
});

let issueIndex = new Mutex();
let ISSUE_INDEX = 0;
const GetIssueIndex = async maxIndex => {
  let release = await issueIndex.acquire();
  let returnVal = ISSUE_INDEX;
  ISSUE_INDEX++;
  release();
  if (returnVal > maxIndex) {
    return null;
  }
  return returnVal;
};
let mapMutex = new Mutex();
// !一把大锁加上，应该不会死锁
class ConcurrentMap extends Map {
  has = async value => {
    let release = await mapMutex.acquire();
    let returnVal = super.has(value);
    release();
    return returnVal;
  };
  get = async value => {
    let release = await mapMutex.acquire();
    let returnVal = super.get(value);
    release();
    return returnVal;
  };
  set = async (key, value) => {
    let release = await mapMutex.acquire();
    super.set(key, value);
    release();
  };
}
let FROMCACHESET;
const AsyncFetchCommentInfo = async (
  owner,
  repo,
  issues,
  mmap,
  issueCommentMap,
) => {
  while (1) {
    let i = await GetIssueIndex(issues.length - 1);
    if (!i) {
      return;
    }
    let issue = issues[i];
    let baseDay = issue.created_at.substring(0, 7) + '-01';
    if (FROMCACHESET.has(baseDay)) {
      break;
    }
    if (issue.comment_count) {
      let comment = issueCommentMap.get(issue.id);
      // 暂时不考虑机器人
      if (comment) {
        // 之前已经存储到这里了
        // 直接计算得到第一次响应的时间
        const begin = Date.parse(issue.created_at);
        const first_response = Date.parse(comment.created_at);
        const key = issue.created_at.substring(0, 8) + '01';
        try {
          let arr = await mmap.get(key);
          if (!arr) {
            await mmap.set(key, [first_response - begin]);
          } else {
            arr.push(first_response - begin);
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        try {
          let commentsResponse = null;
          try {
            commentsResponse = await octokit.request(
              '/repos/{owner}/{repo}/issues/{issue_number}/comments',
              {
                owner: owner,
                repo: repo,
                issue_number: issue.number,
                page: 1,
                per_page: 20,
              },
            );
          } catch (e) {
            console.log(e);
            throw e;
          }
          // 只插入最早的comment
          let index = 0;
          for (index = 0; index < commentsResponse.data.length; index++) {
            if (commentsResponse.data[index].user.type === 'User') {
              break;
            }
            index++;
          }
          if (i == commentsResponse.data.length) {
            continue;
          }
          // 排除机器人
          let firstComment = commentsResponse.data[index];
          if (!firstComment) {
            continue;
          }
          const newComment = {
            url: firstComment.html_url ? firstComment.html_url : ' ',
            created_at: firstComment.created_at,
            issue_id: issue.id,
            body: firstComment.body,
            repo_owner: issue.repo_owner,
            repo_name: issue.repo_name,
          };
          const createComment = await IssueCommentSchema.create(newComment);
          // 直接计算得到第一次响应的时间
          const begin = Date.parse(issue.created_at);
          const first_response = Date.parse(firstComment.created_at);
          const key = issue.created_at.substring(0, 8) + '01';
          let arr = await mmap.get(key);
          if (!arr) {
            await mmap.set(key, [first_response - begin]);
          } else {
            arr.push(first_response - begin);
          }
        } catch (e) {
          continue;
        }
      }
    }
  }
};
const getFirstResponseTimeMap = async (owner, repo) => {
  console.log('getCommentInfo');

  let fromCacheSet = new Set();
  // 倒序
  let cacheArray = await issueCommentsCacheSchema
    .find({
      repo_name: repo,
      repo_owner: owner,
    })
    .sort([['month', -1]]);
  cacheArray.forEach(cache => {
    fromCacheSet.add(cache.month);
  });
  FROMCACHESET = fromCacheSet;
  // console.log(FROMCACHESET);
  let mmap = new ConcurrentMap();
  const issues = await IssueSchema.find({
    repo_owner: owner,
    repo_name: repo,
  }).sort([['created_at', -1]]);
  const issueCommentsCache = await IssueCommentSchema.find({
    repo_owner: owner,
    repo_name: repo,
  });
  let issueCommentMap = new Map();

  issueCommentsCache.forEach(value => {
    issueCommentMap.set(value.issue_id, value);
  });

  try {
    await Promise.all([
      AsyncFetchCommentInfo(owner, repo, issues, mmap, issueCommentMap),
      AsyncFetchCommentInfo(owner, repo, issues, mmap, issueCommentMap),
      AsyncFetchCommentInfo(owner, repo, issues, mmap, issueCommentMap),
      AsyncFetchCommentInfo(owner, repo, issues, mmap, issueCommentMap),
      AsyncFetchCommentInfo(owner, repo, issues, mmap, issueCommentMap),
      AsyncFetchCommentInfo(owner, repo, issues, mmap, issueCommentMap),
      AsyncFetchCommentInfo(owner, repo, issues, mmap, issueCommentMap),
      AsyncFetchCommentInfo(owner, repo, issues, mmap, issueCommentMap),
      AsyncFetchCommentInfo(owner, repo, issues, mmap, issueCommentMap),
      AsyncFetchCommentInfo(owner, repo, issues, mmap, issueCommentMap),
    ]);
    let returnVal = {};
    mmap.forEach((value, key) => {
      value.sort((a, b) => {
        return a - b;
      });
      let fastest = 0;
      let pre25 = Math.floor(value.length / 4);
      let mid = Math.floor(value.length / 2);
      let pre75 = Math.floor((value.length * 3) / 4);
      let slowest = value.length - 1;
      returnVal[key] = {
        fastest: value[fastest],
        pre25: value[pre25],
        mid: value[mid],
        pre75: value[pre75],
        slowest: value[slowest],
      };
    });

    //cache
    let currentMonth = new Date().toISOString().substring(0, 7) + '-01';
    for (const e in returnVal) {
      if (e == currentMonth) {
        break;
      }
      await issueCommentsCacheSchema.create({
        month: e,
        value: returnVal[e],
        repo_owner: owner,
        repo_name: repo,
      });
    }
    cacheArray.forEach(t => {
      returnVal[t.month] = t.value;
    });
    return returnVal;
  } catch (e) {
    console.log('error: ', e);
    throw e;
  } finally {
    ISSUE_INDEX = 0;
  }
};

const getIssueCloseTime = async (owner, repo) => {
  // 遍历issue表即可
  const issues = await IssueSchema.find({
    repo_owner: owner,
    repo_name: repo,
  }).sort([['created_at', -1]]);
  const mmap = new Map();
  issues.forEach(issue => {
    let createmonth = issue.created_at.substring(0, 8) + '01';
    if (!mmap.get(createmonth)) {
      mmap.set(createmonth, {
        'month-opened': 0,
        'month-closed': 0,
        'total-opened': 0,
        'total-closed': 0,
      });
    }
    let createmonthinfo = mmap.get(createmonth);
    createmonthinfo['month-opened']++;

    if (issue.closed_at) {
      let closemonth = issue.closed_at.substring(0, 8) + '01';
      if (!mmap.get(closemonth)) {
        mmap.set(closemonth, {
          'month-opened': 0,
          'month-closed': 0,
          'total-opened': 0,
          'total-closed': 0,
        });
      }
      let closemonthinfo = mmap.get(closemonth);
      closemonthinfo['month-closed']++;
    }
  });
  const object = Object.fromEntries(mmap);
  let returnObj = Object.keys(object)
    .sort()
    .reduce((obj, key) => {
      obj[key] = object[key];
      return obj;
    }, {});
  let keys = Object.keys(returnObj);
  for (let i = 0; i < keys.length; i++) {
    if (!i) {
      returnObj[keys[i]]['total-opened'] = returnObj[keys[i]]['month-opened'];
      returnObj[keys[i]]['total-closed'] = returnObj[keys[i]]['month-closed'];
    } else {
      returnObj[keys[i]]['total-opened'] =
        returnObj[keys[i]]['month-opened'] +
        returnObj[keys[i - 1]]['total-opened'];
      returnObj[keys[i]]['total-closed'] =
        returnObj[keys[i]]['month-closed'] +
        returnObj[keys[i - 1]]['total-closed'];
    }
  }
  return returnObj;
};

const IssueCommentUtil = {
  getFirstResponseTimeMap,
  getIssueCloseTime,
};
module.exports = IssueCommentUtil;
