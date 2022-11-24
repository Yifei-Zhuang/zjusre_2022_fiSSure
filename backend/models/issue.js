const mongoose = require('mongoose');
const IssueSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: [true, 'must provide id'], //must have the property
  },
  number: {
    type: Number,
  },
  url: {
    type: String,
  },
  title: {
    type: String,
  },
  state: {
    type: String,
  },
  is_locked: {
    type: Boolean,
  },
  body: {
    type: String,
  },
  created_at: {
    type: String,
    required: [true, 'must provide created_at'],
  },
  updated_at: {
    type: String,
    required: [true, 'must provide updated_at'],
  },
  closed_at: {
    type: String,
  },
  repos_id: {
    type: Number,
  },
  user_id: {
    type: Number,
  },
  user_name: {
    type: String,
  },
  comment_count: {
    type: Number,
    require: [true, 'must provide comment_count'],
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
module.exports = mongoose.model('Issue', IssueSchema);
