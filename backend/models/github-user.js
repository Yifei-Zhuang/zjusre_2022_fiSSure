const mongoose = require('mongoose');
const GithubUserSchema = new mongoose.Schema({
  login: {
    type: String,
    required: [true, 'must provide loginname'],
  },
  company: {
    type: String,
    require: [true, 'must provide company'],
  },
});
module.exports = mongoose.model('GithubUser', GithubUserSchema);
