'use strict';

import Sequelize from 'sequelize';

export default function (sequelize, DataTypes) {
  return sequelize.define("hashtags", {
    id: {
      field: 'id',
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    slug: {
      field: 'slug',
      allowNull: false,
      type: DataTypes.STRING,
    },
    name: {
      field: 'name',
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'hashtags'
  });
}
