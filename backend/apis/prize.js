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

function validate(req)
{
  const body = req.body;
  let data = {};

  return validator.filled([
    body.sponsor
  , body.item
  , body.quantity
  ])
  .then(() => validator.required(body.sponsor, 'Sponsor'))
  .then((sponsor) => {
    data.sponsor = sponsor;
    return validator.required(body.item, 'Item');
  })
  .then((item) => {
    data.item = item;
    return validator.required(String(body.quantity), 'Quantity', validator.isInt);
  })
  .then((quantity) => {
    data.quantity = validator.toInt(quantity);
    return Promise.resolve(data);
  });
}


module.exports = {
  __exprest: {
    routes: [{
      action: 'list'
    }, {
      action: 'add'
    , method: 'post'
    }, {
      action: 'edit'
    , path:   ':id'
    , method: 'put'
    }, {
      action: 'remove'
    , path:   ':id'
    , method: 'delete'
    }, {
      action: 'reorder'
    , path:   'reorder'
    , method: 'post'
    }]
  }

, list: (req, res, next) => {
    models(req).Prize.findAll({
      order: [
        [ 'priority', 'DESC' ]
      ]
    })
    .then((rows) => res.json(rows))
    .catch(next);
  }

, add: (req, res, next) => {
    let newPrize = null;

    validate(req)
    .then((data) => models(req).Prize.create(data))
    .then((row) => {
      newPrize = row.get({ plain: true });
      return models(req).Prize.findAll({
        where: {
          id: {
            [Sequelize.Op.ne]: row.id
          }
        }
      });
    })
    .then((rows) => {
      return Promise.all(
        rows.map((row) => row.update({ priority: row.priority + 1 }))
      );
    })
    .then(() => res.json(newPrize))
    .catch(next);
  }

, edit: (req, res, next) => {
    validate(req)
    .then((data) => {
      return models(req).Prize.findByPk(req.params.id)
      .then((row) => row ? row.update(data) : Promise.reject(httperr(404)));
    })
    .then(() => res.end())
    .catch(next);
  }

, remove: (req, res, next) => {
    models(req).Prize.findByPk(req.params.id)
    .then((row) => row ? row.destroy() : Promise.resolve())
    .then(() => res.end())
    .catch(next);
  }

, reorder: (req, res, next) => {
    validator.filled([ req.body.order ])
    .then(() => validator.required(req.body.order, 'Order'))
    .then((order) => {
      order = order.split(',').map((n) => parseInt(n)).reverse();
      return models(req).Prize.findAll()
      .then((rows) => {
        return Promise.all(
          rows.map((row) => {
            return row.update({
              priority: order.indexOf(row.id) + 1
            });
          })
        );
      })
    })
    .then(() => res.end())
    .catch(next);
  }
};
