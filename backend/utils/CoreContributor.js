const CommitSchema = require('../models/commit');
const { Octokit } = require('@octokit/core');
const config = require('../config');
const { default: mongoose } = require('mongoose');
const { RepoCommitTimeFilter } = require('../controllers/commit');
const { AsyncFunctionWrapper } = require('../utils');
const { Mutex } = require('async-mutex');
const { OctokitRequest } = require('../utils/index');
const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN || config.GITHUB_ACCESS_TOKEN,
});
const GithubUserSchema = require('../models/github-user');
/**
 * @brief 获取指定仓库的 2019-2022 每年的核心贡献者
 * @param {*} owner
 * @param {*} repo
 */
const GetCoreContributorByYear1 = async (owner, repo) => {
  try {
    // 为了摸鱼，所以暂时只统计 2019-2022 的核心贡献者
    let coreContributorByYear = [];
    for (let i = 2019; i < 2023; i++) {
      let start = i + '-01-01';
      let end = i + 1 + '-01-01';
      let contributorCommitNumber = new Map();
      let allCommitsOfRepo = await CommitSchema.find({
        repo_owner: owner,
        repo_name: repo,
        updated_at: { $gt: `${i}-01-01`, $lt: `${i + 1}-01-01` }
      });
      const totalCommits = allCommitsOfRepo.length;
      allCommitsOfRepo.forEach(commit => {
        if (contributorCommitNumber.has(commit.author_name)) {
          contributorCommitNumber.set(
            commit.author_name,
            contributorCommitNumber.get(commit.author_name) + 1,
          );
        } else {
          contributorCommitNumber.set(commit.author_name, 1);
        }
      });
      // console.log(contributorCommitNumber);
      let sortedContributor = [];
      contributorCommitNumber.forEach((value, key) => {
        sortedContributor.push({
          contributor: key,
          commit: value,
        });
      });
      sortedContributor.sort((a, b) => b.commit - a.commit);
      // console.log(sortedContributor);
      let nowCommits = 0;
      let coreContributor = [];
      let index = 0;
      while (
        nowCommits < 0.8 * totalCommits &&
        index < sortedContributor.length
      ) {
        coreContributor.push({
          contributor: sortedContributor[index].contributor,
          commit: sortedContributor[index].commit,
        });
        nowCommits += sortedContributor[index].commit;
        index += 1;
      }

      // console.log("finally");
      let contributorCompany = await GetContributorCompanyDistribution(
        coreContributor,
      );
      // console.log(contributorCompany);
      let contributorCompanyArray = [];
      contributorCompany.forEach((value, key) => {
        contributorCompanyArray.push({
          company: key,
          coreContributors: value,
        });
      });
      contributorCompanyArray.sort(
        (a, b) => b.coreContributors - a.coreContributors,
      );
      coreContributorByYear.push({
        year: i,
        coreContributor: coreContributor,
        coreContributorCompany: contributorCompanyArray,
      });
    }

    return coreContributorByYear;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

let contributorIndexMutex = new Mutex();
let CONTRIBUTOR_INDEX = 0;
const GetContributorIndex = async maxIndex => {
  let release = await contributorIndexMutex.acquire();
  let returnVal = CONTRIBUTOR_INDEX;
  CONTRIBUTOR_INDEX++;
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

const AsyncFetchUserInfo = async (
  coreContributor,
  contributorCompanyMap,
  map,
) => {
  let maxIndex = coreContributor.length - 1;
  while (1) {
    let index = await GetContributorIndex(maxIndex);
    if (index == undefined) {
      return;
    }
    let company = null;
    try {
      company = map.get(coreContributor[index].contributor);
      if (company === undefined) {
        const userInfo = await octokit.request('GET /users/{username}', {
          username: coreContributor[index].contributor,
        });
        // console.log(userInfo);
        company = userInfo.data.company;
        // 存储
        await GithubUserSchema.create({
          login: coreContributor[index].contributor,
          company: company,
        });
      }
    } catch (e) {
      // console.log(e);
    } finally {
      if (company == null || company === undefined || company == '') {
        company = 'other';
      }
      // console.log(company);
      if (await contributorCompanyMap.has(company)) {
        await contributorCompanyMap.set(
          company,
          (await contributorCompanyMap.get(company)) + 1,
        );
      } else {
        await contributorCompanyMap.set(company, 1);
      }
      // console.log(contributorCompanyMap.size);
      // console.log(contributorCompany);
    }
  }
};
// 同步的公司分析，速度比较缓慢，考虑使用异步
const GetContributorCompanyDistribution = async coreContributor => {
  let contributorCompany = new ConcurrentMap();
  let githubUsers = await GithubUserSchema.find();
  let map = new Map();
  githubUsers.forEach(user => {
    map.set(user.login, user.company);
  });
  await AsyncFunctionWrapper(
    AsyncFetchUserInfo,
    coreContributor,
    contributorCompany,
    map,
  );
  CONTRIBUTOR_INDEX = 0;
  return contributorCompany;
};

module.exports = {
  GetCoreContributorByYear1,
};
