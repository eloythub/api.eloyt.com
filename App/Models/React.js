'use strict'

import Sequelize from 'sequelize'
import ReactTypesEnum from '../Enums/ReactTypesEnum'

export default function (sequelize, DataTypes) {
  return sequelize.define('React', {
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
    type: {
      field: 'type',
      type: DataTypes.ENUM(
        ReactTypesEnum.skip,
        ReactTypesEnum.like,
        ReactTypesEnum.dislike
      ),
      allowNull: true
    },
    reactedAt: {
      field: 'reacted_at',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'react',
    underscored: true,
    timestamps: true,
    createdAt: 'reactedAt',
    updatedAt: false,
    deletedAt: false
  })
}
