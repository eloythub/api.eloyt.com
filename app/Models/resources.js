'use strict'

import Sequelize from 'sequelize'

export default function (sequelize, DataTypes) {
  return sequelize.define('Resources', {
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
        model: 'Users',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    },
    cloudUrl: {
      field: 'cloud_url',
      allowNull: false,
      type: DataTypes.STRING
    },
    geoLocation: {
      field: 'geo_location',
      allowNull: true,
      type: DataTypes.GEOMETRY
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'resources',
    underscored: true,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false,
    deletedAt: false,
  })
}
