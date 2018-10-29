/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

const path = require('path')
    , express = require('express')
    , server = express()
    , supertest = require('supertest')
    , request = supertest(server)
    , cheerio = require('cheerio')
    , methods = require('methods')
    , _ = require('underscore')
    , app = require('../backend')
;

function create_request_handlers(basePath)
{
  const baseUrl = basePath || '';
  let handlers = {};

  methods.forEach((method) => {
    if (method == 'delete') {
      method = 'del';
    }

    handlers[method] = (path, ajax) => {
      let req = request[method](baseUrl+path);

      if (ajax !== false) {
        req.set('X-Requested-With', 'XMLHttpRequest');
      }
      req.set('Host', 'localhost');

      return req;
    };
  });

  return handlers;
}

function promise(req)
{
  return new Promise((resolve, reject) => {
    req.end((err) => {
      err ? reject(err) : resolve();
    });
  });
}

let setupDone = false;

const me = module.exports = {

  setup: (done) => {
    if (setupDone) {
      return done();
    }

    app.setup(server)
    .then(() => {
      setupDone = true;
      done();
    })
    .catch(done);
  }

, request: {
    html: create_request_handlers()
  , api: create_request_handlers('/api')
  }

, param: {
    stringify: (json) => _.mapObject(json, (val) => `${val}`)
  , omit: (json, key) => _.omit(me.param.stringify(json), key)
  , overwrite: (json, value) => _.extend(me.param.stringify(json), me.param.stringify(value))
  }

, expect: {
    html: (req, status, check) => {
      if (_.isFunction(status)) {
        check = status;
        status = 200;
      }

      return promise(
        req.expect(status)
           .expect((res) => {
             res.should.be.html;
             if (_.isFunction(check)) {
               check(cheerio.load(res.text));
             }
           })
      );
    }
  , json: (req, status, check) => {
      if (_.isUndefined(status) || _.isFunction(status)) {
        check = status;
        status = 200;
      }

      return promise(
        req.expect(status)
           .expect((res) => {
             res.should.be.json;
             if (_.isFunction(check)) {
               check(res.body);
             }
           })
      );
    }
  , jsonError: (req, message, name, status) => {
      return me.expect.json(req, status || 403, (json) => {
        json.should.have.property('message', message);
        json.should.have.property('name', name || 'AppError');
      });
    }
  , jsonErrorParamShortage: (req) => {
      return me.expect.jsonError(req, 'Missing a parameter.');
    }
  , jsonErrorParamRequired: (req, label) => {
      return me.expect.jsonError(req, `${label} is not given.`);
    }
  , jsonErrorParamInvalid: (req, label) => {
      return me.expect.jsonError(req, `Invalid ${label} is given.`);
    }
  }
};
