"use strict";

module.exports = function(app) {
    const analyticsCtrl = require('../controllers/analytics_controller');

    app.post('/get_data', analyticsCtrl.getData);

    app.post('/log_event', analyticsCtrl.getData);

    app.put('/log_hit', analyticsCtrl.logHit);

    app.get('/review_daily_logs', analyticsCtrl.reviewDailyLogs);
};
