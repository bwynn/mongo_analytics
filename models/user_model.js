const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const UserSchema = new Schema({
    user_id: String,
    sessions: [
        {
            date: {type: Date, default: Date.now},
            duration: Number,
            paths: [String]
        }
    ],
    totalSessions: Number
});

module.exports = mongoose.model('User', UserSchema);
