const CommitSchema = require('../models/commit');
const {Octokit} = require('@octokit/core');
const config = require('../config');
const {default: mongoose} = require('mongoose');
const {RepoCommitTimeFilter} = require('./commit');

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN || config.GITHUB_ACCESS_TOKEN,
});

/**
 * @brief 获取指定仓库的 2019-2022 每年的核心贡献者
 * @method post
 * @param {*} req
 * @param {*} res
 */
const GetCoreContributorByYear = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    // 为了摸鱼，所以暂时只统计 2019-2022 的核心贡献者
    let coreContributorByYear = [];
    for (let i = 2019; i < 2023; i++) {
      let start = i + '-01-01';
      let end = i + 1 + '-01-01';
      let contributorCommitNumber = new Map();
      let allCommitsOfRepo = await RepoCommitTimeFilter(
        owner,
        repo,
        start,
        end,
      );
      // console.log(allCommitsOfRepo);
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
      let contributorCompany = await GetContributorCompanyDistribution(coreContributor);
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
    return res.status(200).json({
      coreContributorByYear,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      msg: 'fail',
      err: e,
    });
  }
};

// TODO：同步的公司分析，速度比较缓慢，考虑使用异步
const GetContributorCompanyDistribution = async (coreContributor) => {
  let contributorCompany = new Map();
  for (contributor of coreContributor) {
    let company = null;
    try {
      const userInfo = await octokit.request('GET /users/{username}', {
        username: contributor.contributor,
      });
      // console.log(userInfo);
      company = userInfo.data.company;
    } catch (e) {
      console.log(e);
    } finally {
      if (company == null || company == '') {
        company = 'other';
      }
      // console.log(company);
      if (contributorCompany.has(company)) {
        contributorCompany.set(
          company,
          contributorCompany.get(company) + 1,
        );
      } else {
        contributorCompany.set(company, 1);
      }
      // console.log(contributorCompany);
    }
  }
  return contributorCompany;
}

module.exports = {
  GetCoreContributorByYear,
};
