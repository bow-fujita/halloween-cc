/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

const config = require('config')
    , validator = require('validator')
;

module.exports = {
  __exprest: {
    preset: {
      middleware: (req, res, next) => {
        res.locals.baseUrl = config.baseUrl || '/';
        next();
      }
    }
  , routes: [{
      action: 'register'
    }, {
      action: 'participants'
    , path: 'participants'
    }, {
      action: 'judges'
    , path: 'judges'
    }, {
      action: 'prizes'
    , path: 'prizes'
    }, {
      action: 'score'
    , path: 'score/:id'
    , validator: {
        id: validator.isNumeric
      }
    }, {
      action: 'result'
    , path: 'result'
    }]
  }

, register: (req, res) => {
    res.render('register');
  }

, participants: (req, res) => {
    res.render('participants');
  }

, judges: (req, res) => {
    res.render('judges');
  }

, prizes: (req, res) => {
    res.render('prizes');
  }

, score: (req, res) => {
    res.render('score', { id: req.params.id });
  }

, result: (req, res) => {
    res.render('result');
  }
};
