const mongoose = require('mongoose');
const PullSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: [true, 'must provide id'], //must have the property
  },
  url: {
    type: String,
    required: [true, 'must provide url'],
  },
  number: {
    type: Number,
    required: [true, 'must provide number'],
  },
  state: {
    type: String,
    required: [true, 'must provide state'],
  },
  title: {
    type: String,
    required: [true, 'must provide title'],
  },
  isLocked: {
    type: Boolean,
    required: [true, 'must provide isLocked'],
  },
  body: {
    type: String,
    required: [true, 'must provide body'],
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
  is_merged: {
    type: Boolean,
    required: [true, 'must provide is_merged'],
  },
  repos_id: {
    type: Number,
    required: [`true,'must provide repo's id`],
  },
  user_id: {
    type: String,
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
module.exports = mongoose.model('Pull', PullSchema);
