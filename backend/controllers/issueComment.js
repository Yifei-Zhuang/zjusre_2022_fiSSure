const {Octokit} = require('@octokit/core');
const config = require('../config');
const {default: mongoose} = require('mongoose');
const issueCommentUtil = require('../utils/issueComment');
const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN || config.GITHUB_ACCESS_TOKEN,
});

const GetIssueResponseTime = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    if (!owner || !repo) {
      throw 'missing body';
    }
    let returnVal = await issueCommentUtil.getFirstResponseTimeMap(owner, repo);
    res.status(200).json({
      msg: 'success',
      returnVal,
    });
  } catch (err) {
    res.status(500).json({
      msg: 'fail',
      err: err,
    });
  }
};
const GetIssueCloseTime = async (req, res) => {
  try {
    const owner = req.body.owner;
    const repo = req.body.repo;
    if (!owner || !repo) {
      throw 'missing body';
    }
    let returnVal = await issueCommentUtil.getIssueCloseTime(owner, repo);
    res.status(200).json({
      msg: 'success',
      returnVal,
    });
  } catch (err) {
    res.status(500).json({
      msg: 'fail',
      err: err,
    });
  }
};

module.exports = {
  GetIssueResponseTime,
  GetIssueCloseTime,
};
