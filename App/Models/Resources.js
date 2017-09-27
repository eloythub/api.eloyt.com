'use strict'

import Sequelize from 'sequelize'
import ResourceTypesEnum from '../Enums/ResourceTypesEnum'

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
      type: DataTypes.ENUM(
        ResourceTypesEnum.avatar,
        ResourceTypesEnum.video,
        ResourceTypesEnum.thumbnail
      ),
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
    cloudFilename: {
      field: 'cloud_filename',
      allowNull: false,
      type: DataTypes.STRING
    },
    uploaded_at: {
      field: 'uploaded_at',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'resources',
    underscored: true,
    timestamps: true,
    createdAt: 'uploaded_at',
    updatedAt: false,
    deletedAt: false
  })
}
