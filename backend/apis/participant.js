/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

const validator = global.lib('validator')
    , httperr = global.lib('httperr')
    , _ = require('underscore')
    , Sequelize = require('sequelize')
    , models = (req) => req.app.locals.models
;

module.exports = {
  __exprest: {
    routes: [{
      action: 'list'
    }, {
      action: 'fetch'
    , path:   ':id'
    }, {
      action: 'register'
    , method: 'post'
    }, {
      action: 'remove'
    , path:   ':id'
    , method: 'delete'
    }, {
      action: 'score'
    , path:   'score/:id'
    , method: 'post'
    }]
  }

, list: (req, res, next) => {
    let options = {
          order: [
            [ 'createdAt' ]
          ]
        };

    if (!_.isUndefined(req.query.rank)) {
      options.order.unshift([ 'score', 'DESC' ]);
    }

    models(req).Participant.findAll(options)
    .then((rows) => res.json(rows))
    .catch(next);
  }

, fetch: (req, res, next) => {
    const Participant = models(req).Participant;

    Participant.findByPk(req.params.id)
    .then((row) => {
      if (!row) {
        return Promise.reject(httperr(404));
      }

      let json = row.get({ plain: true });

      return Participant.findOne({
        where: {
          id: {
            [Sequelize.Op.lt]: row.id
          }
        }
      , order: [
          [ 'id', 'DESC' ]
        ]
      })
      .then((prevRow) => {
        json.prev = prevRow ? prevRow.id : null;

        return Participant.findOne({
          where: {
            id: {
              [Sequelize.Op.gt]: row.id
            }
          }
        , order: [
            [ 'id' ]
          ]
        });
      })
      .then((nextRow) => {
        json.next = nextRow ? nextRow.id : null;
        return res.json(json);
      });
    })
    .catch(next);
  }

, register: (req, res, next) => {
    const body = req.body;
    let data = {};

    validator.filled([
      body.fullname
    , body.costume
    , body.message
    ])
    .then(() => validator.required(body.fullname, 'Fullname'))
    .then((fullname) => {
      data.fullname = fullname;
      return validator.required(body.costume, 'Costume');
    })
    .then((costume) => {
      data.costume = costume;
      return validator.optional(body.message, 'Appeal to the Judges');
    })
    .then((message) => {
      data.message = message;
      return models(req).Participant.create(data);
    })
    .then((row) => {
      res.json(_.pick(row, [ 'id', 'fullname' ]));
    })
    .catch(next);
  }

, remove: (req, res, next) => {
    models(req).Participant.findByPk(req.params.id)
    .then((row) => row ? row.destroy() : Promise.resolve())
    .then(() => res.end())
    .catch(next);
  }

, score: (req, res, next) => {
    validator.filled([ req.body.score ])
    .then(() => validator.required(req.body.score, 'Score', validator.isInt))
    .then((score) => {
      return models(req).Participant.findByPk(req.params.id)
      .then((row) => {
        return !row ?
               Promise.reject(httperr(404)) :
               row.update({ score: validator.toInt(score) });
      })
    })
    .then(() => res.end())
    .catch(next);
  }
};

