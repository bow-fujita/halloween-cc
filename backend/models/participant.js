/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Participant', {
    fullname: {
      type: DataTypes.STRING
    , allowNull: false
    }
  , costume: {
      type: DataTypes.STRING
    , allowNull: false
    }
  , message: {
      type: DataTypes.TEXT
    }
  , score: {
      type: DataTypes.INTEGER
    , defaultValue: null
    }
  });
};
