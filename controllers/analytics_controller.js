"use strict";

const Analytics = require('../models/analytics_model'),
      DailyStats = require('../models/daily_stats_model');

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

exports.logHit = function(req, res) {

    // update daily stats doc
    const d = new Date, // new date
          t = d.getTime(), // convert to ms
          tsStr = t.toString(), // conver to string,
          toISO = d.toISOString(),
          id_daily = tsStr + req.route.path, // create id string
          hour = d.getHours(), // get current hour
          minute = d.getMinutes(); // get current minutes

    // get datetime that only includes date info
    const query = {'_id': id_daily, 'metadata': {'date': toISO, 'site': req.route.path}},
          update = {'$inc': {
              'hourly': hour,
              'minute.$.hour': minute
          }};

          DailyStats.update(query, update, {upsert: true}, function(err, data) {
              if (err) {
                  res.send(err);
              }

              res.json(data);
          });

    // update monthly stats document
};

exports.reviewDailyLogs = function(req, res) {
    DailyStats.find(function(err, data) {
        if (err) {
            res.send(err);
        }

        res.json(data);
    }, function(rejected) {
        res.send(rejected);
    });
};
