const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const analyticsSchema = new Schema({
    host: String,
    time: {type: Date, default: Date.now},
    path: String,
    referer: String,
    user_agent: String
});

module.exports = mongoose.model('Analytics', analyticsSchema);
