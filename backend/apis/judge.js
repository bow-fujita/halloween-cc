/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

const validator = global.lib('validator')
    , models = (req) => req.app.locals.models
;

module.exports = {
  __exprest: {
    routes: [{
      action: 'list'
    }, {
      action: 'add'
    , method: 'post'
    }, {
      action: 'remove'
    , path:   ':id'
    , method: 'delete'
    }]
  }

, list: (req, res, next) => {
    models(req).Judge.findAll()
    .then((rows) => res.json(rows))
    .catch(next);
  }

, add: (req, res, next) => {
    validator.filled([ req.body.name ])
    .then(() => validator.required(req.body.name, 'Name'))
    .then((name) => models(req).Judge.create({ name: name }))
    .then((row) => res.json(row))
    .catch(next);
  }

, remove: (req, res, next) => {
    models(req).Judge.findByPk(req.params.id)
    .then((row) => row ? row.destroy() : Promise.resolve())
    .then(() => res.end())
    .catch(next);
  }
};
