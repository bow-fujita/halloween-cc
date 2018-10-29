/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

const http = require('http')
    , _ = require('underscore')
    , AppError = require('../apperr')
;

module.exports = (status, message, extra) => {
  if (status instanceof Error) {
    return _.defaults(status, { status: 500 });
  }

  if(!_.isNumber(status)) {
    if (!_.isString(status)) {
      throw new AppError('Invalid argument');
    }
    extra = message;
    message = status;
    status = 500;
  }
  else if (message instanceof AppError) {
    message.status = status;
    return message;
  }

  message = message || http.STATUS_CODES[status];

  if (_.isString(extra)) {
    extra = { name: extra };
  }
  else if (!_.isObject(extra)) {
    extra = {};
  }
  extra.status = status;

  return new AppError(message, extra);
};
