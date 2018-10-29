/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Judge', {
    name: {
      type: DataTypes.STRING
    , allowNull: false
    }
  }, {
    timestamps: false
  });
};
