"use strict";

const Analytics = require('../models/analytics_model');

exports.getData = function(req, res) {
    const report = new Analytics();

    report.host = req.headers.host;
    report.path = req.route.path;
    report.referer = req.headers.referer;
    report.user_agent = req.headers['user-agent'];

    report.save(function(err, data) {
        if (err) {
            res.send(err);
        }

        res.json({message: "Analytics log record created"});
    });
};
