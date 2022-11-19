const express = require('express');
const router = express.Router();

const {
  GetMessage,
  SearchRepoName,
  GetDashboard,
  DeleteRepo,
} = require('../controllers/dash');
const {CheckUser, CreateUser} = require('../controllers/user');
const {
  GetCommitInfo,
  GetAllCommitsOfRepo,
  GetRepoCommitFrequencyByYear,
  GetRepoCommitFrequencyByMonth,
  GetRepoCommitFrequencyByDay,
  GetCommitersCountInRange,
} = require('../controllers/commit');
const {
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
} = require('../controllers/pull');
const {
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
} = require('../controllers/issue');
router.route('/import').post(GetMessage);
router.route('/login').post(CheckUser);
router.route('/register').post(CreateUser);
router.route('/search').post(SearchRepoName);
router.route('/dashboard').post(GetDashboard);
router.route('/delete').post(DeleteRepo);
//! commit
router.route('/getCommitInfo').post(GetCommitInfo);
router.route('/getCommit').post(GetAllCommitsOfRepo);
router
  .route('/GetRepoCommitFrequencyByYear')
  .post(GetRepoCommitFrequencyByYear);
router
  .route('/GetRepoCommitFrequencyByMonth')
  .post(GetRepoCommitFrequencyByMonth);
router.route('/GetRepoCommitFrequencyByDay').post(GetRepoCommitFrequencyByDay);
router.route('/GetCommitersCountInRange').post(GetCommitersCountInRange);

//! Pull
router.route('/GetPullInfo').post(GetPullInfo);
router.route('/GetAllPullOfRepo').post(GetAllPullOfRepo);
router
  .route('/GetRepoPullUpdateFrequencyByYear')
  .post(GetRepoPullUpdateFrequencyByYear);
router
  .route('/GetRepoPullCloseFrequencyByYear')
  .post(GetRepoPullCloseFrequencyByYear);
router
  .route('/GetRepoPullCreateFrequencyByYear')
  .post(GetRepoPullCreateFrequencyByYear);
router
  .route('/GetRepoPullUpdateFrequencyByMonth')
  .post(GetRepoPullUpdateFrequencyByMonth);
router
  .route('/GetRepoPullCloseFrequencyByMonth')
  .post(GetRepoPullCloseFrequencyByMonth);
router
  .route('/GetRepoPullCreateFrequencyByMonth')
  .post(GetRepoPullCreateFrequencyByMonth);
router
  .route('/GetRepoPullUpdateFrequencyByDay')
  .post(GetRepoPullUpdateFrequencyByDay);
router
  .route('/GetRepoPullCloseFrequencyByDay')
  .post(GetRepoPullCloseFrequencyByDay);
router
  .route('/GetRepoPullCreateFrequencyByDay')
  .post(GetRepoPullCreateFrequencyByDay);
router.route('/GetPullersCountInRange').post(GetPullersCountInRange);

//! Issue
router.route('/GetIssueInfo').post(GetIssueInfo);
router.route('/GetAllIssueOfRepo').post(GetAllIssueOfRepo);
router
  .route('/GetRepoIssueUpdateFrequencyByYear')
  .post(GetRepoIssueUpdateFrequencyByYear);
router
  .route('/GetRepoIssueCloseFrequencyByYear')
  .post(GetRepoIssueCloseFrequencyByYear);
router
  .route('/GetRepoIssueCreateFrequencyByYear')
  .post(GetRepoIssueCreateFrequencyByYear);
router
  .route('/GetRepoIssueUpdateFrequencyByMonth')
  .post(GetRepoIssueUpdateFrequencyByMonth);
router
  .route('/GetRepoIssueCloseFrequencyByMonth')
  .post(GetRepoIssueCloseFrequencyByMonth);
router
  .route('/GetRepoIssueCreateFrequencyByMonth')
  .post(GetRepoIssueCreateFrequencyByMonth);
router
  .route('/GetRepoIssueUpdateFrequencyByDay')
  .post(GetRepoIssueUpdateFrequencyByDay);
router
  .route('/GetRepoIssueCloseFrequencyByDay')
  .post(GetRepoIssueCloseFrequencyByDay);
router
  .route('/GetRepoIssueCreateFrequencyByDay')
  .post(GetRepoIssueCreateFrequencyByDay);
router.route('/GetIssuersCountInRange').post(GetIssuersCountInRange);
module.exports = router;
