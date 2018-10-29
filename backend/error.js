/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

module.exports = (err, req, res, next) => {
  const status = err.status || 500
      , stack = err.stack || ''
      , message = `${err.name}: ${err.message}`
  ;

  res.statusCode = status;

  if (req.xhr) {
    res.json({
      name: err.name
    , message: err.message
    , stack: stack.split('\n').slice(1).map((line) => line.trim().replace(/^at /, ''))
    });
  }

  if (status == 500) {
    console.error(message);
    if (stack.length) {
      console.error(stack);
    }
  }
};
