"use strict";

const Analytics = require('../models/analytics_model'),
      DailyStats = require('../models/daily_stats_model'),
      MonthlyStats = require('../models/monthly_stats_schema');

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
          m = d.getMonth().toString(),
          day = d.getDay().toString(),
          y = d.getYear().toString(),
          newD = m + day + y,
          id_daily = newD + req.route.path, // create id string
          hour = parseInt(d.getHours()), // get current hour
          curMinute = d.getMinutes(), // get current minutes
          hourQuery = 'hourly.' + hour.toString(),
          minuteQuery = 'minute.' + hour.toString() + '.' + curMinute.toString(),
          dailyQuery = day,
          site = req.route.path;

    // get datetime that only includes date info
    const query = {'_id': id_daily, 'metadata': {'date': newD, 'site': site}},
          update = {
              '$inc': {[hourQuery]: 1, [minuteQuery]: 1}
          };

          console.log(update);
          DailyStats.findOneAndUpdate(query, update, {upsert: true}, function(err, record) {
              if (err) {
                  res.send(err);
              }

              res.json(record);
          });

    // update monthly stats document
    const monthQuery = {'_id': id_monthly, 'metadata': {'date': day, 'site': site}},
          monthUpdate = {
              '$inc': {[dailyQuery]: 1}
          };

          MonthlyStats.findOneAndUpdate(monthQuery, monthUpdate, {upsert: true}, function(err, data) {
              if (err) {
                  res.send(err);
              }

              res.json(data);
          });
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
