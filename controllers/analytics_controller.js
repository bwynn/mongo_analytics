"use strict";

const Analytics = require('../models/analytics_model'),
      DailyStats = require('../models/daily_stats_model');

// POST - /get_data
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

// PUT - /log_hit
exports.logHit = function(req, res) {

    // update daily stats doc
    const d = new Date, // new date
          t = d.getTime(), // convert to ms
          tsStr = t.toString(), // conver to string,
          toISO = d.toISOString(),
          m = d.getMonth().toString(),
          day = d.getDay().toString(),
          y = d.getYear().toString(),
          newD = m + day + y,
          id_daily = newD + req.route.path, // create id string
          hour = d.getHours(), // get current hour
          curMinute = d.getMinutes(); // get current minutes

    // get datetime that only includes date info
    const query = {'_id': id_daily, 'metadata': {'date': newD, 'site': req.route.path}},
          update = {'$inc': {
            'hourly.0': 1, 
            'minute.0.12': 1
          }};

          console.log(update);

          DailyStats.update(query, update, {upsert: true}, function(err, data) {
              if (err) {
                  res.send(err);
              }

              res.json(data);
          }, function(rejected) {
              console.log(rejected);
          });

    // update monthly stats document
};

// GET - /review_daily_logs
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
