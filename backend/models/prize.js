/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Prize', {
    sponsor: {
      type: DataTypes.STRING
    , allowNull: false
    }
  , item: {
      type: DataTypes.STRING
    , allowNull: false
    }
  , quantity: {
      type: DataTypes.INTEGER
    , allowNull: false
    }
  , priority: {
      type: DataTypes.INTEGER
    , allowNull: false
    , defaultValue: 1
    }
  }, {
    timestamps: false
  });
};
