const mongoose = require('mongoose');
const IssueCommentCacheSchema = new mongoose.Schema({
  month: {
    type: String,
    required: [true, 'must provide month'],
  },
  value: {
    type: Object,
    require: [true, 'must provide value'],
  },
  // 以下为冗余字段，仅供查询使用
  repo_owner: {
    type: String,
    required: [true, 'must provide repo_owner'],
  },
  repo_name: {
    type: String,
    required: [true, 'must provide repo_name'],
  },
});
module.exports = mongoose.model('IssueCommentCache', IssueCommentCacheSchema);
