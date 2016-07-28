"use strict";

const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      morgan = require('morgan'),
      mongoose = require('mongoose');

// config
// =============================================================================
// connect to mongo
mongoose.connect('mongodb://localhost/analytics_mongo');

// define port
const port = process.env.PORT || 3000;

// parse app data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// routes
// =============================================================================
require('./routes/db_routes')(app);

// server
// =============================================================================
app.listen(port);

console.log("connected on port:" + port);

exports = module.exports = app;
