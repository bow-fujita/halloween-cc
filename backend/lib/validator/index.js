/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

const validator = require('validator')
    , _ = require('underscore')
    , httperr = require('../httperr')
;

function invalid(message, name)
{
  return Promise.reject(httperr(403, message, name));
}

function isValid(param, label, required, validate)
{
  param = validator.trim(param);
  if (!param.length) {
    return required ?
           invalid(`${label} is not given.`) : Promise.resolve(null);
  }
  return _.isFunction(validate) && !validate(param) ?
         invalid(`Invalid ${label} is given.`) :
         Promise.resolve(param);
}

module.exports = _.extend({}, validator, {

  required: (param, label, validate) => isValid(param, label, true, validate)

, optional: (param, label, validate) => isValid(param, label, false, validate)

, filled: (params) => {
    return params.filter(_.isUndefined).length ?
           invalid('Missing a parameter.') : Promise.resolve();
  }
});
