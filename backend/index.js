/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

const path = require('path')
    , express = require('express')
    , exprest = require('exprest4')
    , layouts = require('express-ejs-layouts')
    , logger = require('morgan')
    , methodOverride = require('method-override')
    , bodyParser = require('body-parser')
    , baseUrl = require('config').baseUrl || '/'
    // Local library loader
    , lib = global.lib = (name) => require(`./lib/${name}`)
;

module.exports.setup = (app) => {
  const top_dir = path.join(__dirname, '..');
  process.env.TMPDIR = path.join(top_dir, 'tmp');

  // Configure Express
  app.enable('case sensitive routing')
     .set('port', process.env.PORT || 3000)
     .set('views', path.join(__dirname, 'views'))
     .set('view engine', 'ejs')
     .use(logger('dev'))
     .use(methodOverride())
     .use(bodyParser.json())
     .use(bodyParser.urlencoded({ extended: true }))
     .use(layouts)
     .use(express.static(path.join(top_dir, 'public')));

  // Connect to database
  return exprest.model({
    dialect: 'sqlite'
  , storage: path.join(top_dir, 'data/models.sqlite')
  , models: path.join(__dirname, 'models')
  })
  .then((sequelize) => {
    app.locals.models = sequelize.models;
    return sequelize.sync();
  })
  // Configure exprest4
  .then(() => {
    return exprest.route(app, {
      url: baseUrl
    , controllers: path.join(__dirname, 'controllers')
    });
  })
  .then(() => {
    return exprest.route(app, {
      url: `${baseUrl}api`
    , controllers: path.join(__dirname, 'apis')
    });
  })
  .then(() => {
    app.use(require('./error'));
    return Promise.resolve();
  });
};
