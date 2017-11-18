'use strict'

import Sequelize from 'sequelize'

export default function (sequelize, DataTypes) {
  return sequelize.define('UsersLocations', {
    id: {
      field: 'id',
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      field: 'user_id',
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'Users',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    },
    coordination: {
      field: 'coordination',
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false,
    },
    registeredAt: {
      field: 'registered_at',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
  }, {
    tableName: 'users_locations',
    underscored: true,
    timestamps: true,
    createdAt: 'registeredAt',
    updatedAt: false,
    deletedAt: false
  })
}
