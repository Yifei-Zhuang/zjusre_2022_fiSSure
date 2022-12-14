const mongoose = require('mongoose');
const PullMonthCloseCacheSchema = new mongoose.Schema({
    pull_month_close_frequency: {
        type: Object,
        required: [true, 'must provide pull_month_close_frequency'],
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
module.exports = mongoose.model('PullMonthClose', PullMonthCloseCacheSchema);