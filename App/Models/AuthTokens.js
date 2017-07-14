'use strict'

import Sequelize from 'sequelize'

export default function (sequelize, DataTypes) {
  return sequelize.define('AuthTokens', {
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
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'auth_tokens',
    timestamps: false,
    underscored: true
  })
}
