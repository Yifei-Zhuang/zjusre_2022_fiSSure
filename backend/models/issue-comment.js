const mongoose = require('mongoose');
const IssueCommentSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'must provide url'],
  },
  created_at: {
    type: String,
    required: [true, 'must provide created_at'],
  },
  issue_id: {
    type: Number,
  },
  body: {
    type: String,
  },
  issue_number: {
    type: Number,
  },
  valid: {
    type: Boolean,
    default: true,
  }, // 以下为冗余字段，仅供查询使用
  repo_owner: {
    type: String,
    required: [true, 'must provide repo_owner'],
  },
  repo_name: {
    type: String,
    required: [true, 'must provide repo_name'],
  },
});
module.exports = mongoose.model('IssueComment', IssueCommentSchema);
