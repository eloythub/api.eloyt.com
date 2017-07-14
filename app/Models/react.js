'use strict'

import Sequelize from 'sequelize'

export default function (sequelize, DataTypes) {
  return sequelize.define('React', {
    id: {
      field: 'id',
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    type: {
      field: 'type',
      type: DataTypes.ENUM('skip', 'like', 'dislike'),
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
    resourceId: {
      field: 'resource_id',
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Resources',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    },
    reactedAt: {
      field: 'reacted_at',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'react',
    timestamps: false,
    underscored: true
  })
}
