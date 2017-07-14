'use strict'

import Sequelize from 'sequelize'

export default function (sequelize, DataTypes) {
  return sequelize.define('resources', {
    id: {
      field: 'id',
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    type: {
      field: 'type',
      type: DataTypes.ENUM('avatar', 'video', 'thumbnail'),
      allowNull: true
    },
    userId: {
      field: 'user_id',
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    },
    url: {
      field: 'url',
      allowNull: false,
      type: DataTypes.STRING
    },
    geoLocation: {
      field: 'geo_location',
      allowNull: false,
      type: DataTypes.GEOMETRY
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'resources',
    timestamps: false,
    underscored: true
  })
}
