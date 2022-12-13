const mongoose = require('mongoose');
const DashBoardCacheSchema = new mongoose.Schema({
    repo_owner: {
        type: String,
        required: [true, 'must provide repo_owner'],
    },
    repo_name: {
        type: String,
        required: [true, 'must provide repo_name'],
    },
    data: {
        type: Object,
        required: [true, 'must provide data'],
    },
});
module.exports = mongoose.model('DashBoard-Cache', DashBoardCacheSchema);
