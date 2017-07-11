'use strict';

import Sequelize from 'sequelize';

export default function (sequelize, DataTypes) {
  return sequelize.define("react", {
    id: {
      field: 'id',
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    type: {
      field: 'type',
      type: DataTypes.ENUM('skip', 'like', 'dislike'),
      allowNull: true,
    },
    userId: {
      field: 'user_id',
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    resourceId: {
      field: 'resource_id',
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'resources',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    reactedAt: {
      field: 'reacted_at',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  }, {
    tableName: 'react'
  });
}
