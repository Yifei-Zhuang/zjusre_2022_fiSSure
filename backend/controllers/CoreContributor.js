const CommitSchema = require('../models/commit');
const {Octokit} = require('@octokit/core');
const config = require('../config');
const {default: mongoose} = require('mongoose');
const {RepoCommitTimeFilter} = require('./commit');
const {AsyncFunctionWrapper} = require('../utils');
const {Mutex} = require('async-mutex');
const {OctokitRequest} = require('../utils/index');
const {GetCoreContributorByYear1} = require('../utils/CoreContributor');
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
    let coreContributorByYear = await GetCoreContributorByYear1(owner, repo);
    return res.status(200).json({
      coreContributorByYear,
    });
  } catch (e) {
    return res.status(500).json({
      msg: 'fail',
      err: e,
    });
  }
};

module.exports = {
  GetCoreContributorByYear,
};
