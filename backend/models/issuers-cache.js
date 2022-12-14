const mongoose = require('mongoose');
const IssuerCacheSchema = new mongoose.Schema({
    issuer_count: {
        type: Object,
        required: [true, 'must provide issuer_count'],
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
module.exports = mongoose.model('Issuer-cache', IssuerCacheSchema);