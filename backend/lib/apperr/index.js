/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

const util = require('util')
    , _ = require('underscore')
;

module.exports = function(message, extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = 'AppError';
  this.message = message;

  if (extra) {
    if (_.isString(extra)) {
      this.name = extra;
    } else if (_.isObject(extra)) {
      _.defaults(this, extra);
      if (extra.name) {
        this.name = extra.name;
      }
    }
  }
};

util.inherits(module.exports, Error);
