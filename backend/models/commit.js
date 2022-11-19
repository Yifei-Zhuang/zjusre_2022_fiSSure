const mongoose = require('mongoose');
const CommitSchema = new mongoose.Schema({
  sha: {
    type: String,
    required: [true, 'must provide sha'], //must have the property
  },
  url: {
    type: String,
    required: [true, 'must provide url'],
  },
  author_id: {
    type: Number,
  },
  author_name: {
    type: String,
  },
  author_email: {
    type: String,
  },
  updated_at: {
    type: String,
  },
  message: {
    type: String,
  },
  repos_id: {
    type: String,
    required: [true, 'must provide repos_id'],
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
module.exports = mongoose.model('Commit', CommitSchema);
