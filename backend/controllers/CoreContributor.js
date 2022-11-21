const CommitSchema = require('../models/commit');
const {Octokit} = require('@octokit/core');
const config = require('../config');
const {default: mongoose} = require('mongoose');
const {RepoCommitTimeFilter} = require('./commit');

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
      let allCommitsOfRepo = await RepoCommitTimeFilter(owner, repo, start, end);
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
      coreContributorByYear.push({
        year: i,
        coreContributor: coreContributor,
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

module.exports = {
  GetCoreContributorByYear,
};