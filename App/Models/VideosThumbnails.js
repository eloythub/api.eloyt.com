'use strict'

import Sequelize from 'sequelize'

export default function (sequelize, DataTypes) {
  return sequelize.define('VideosThumbnails', {
    id: {
      field: 'id',
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    videoResourceId: {
      field: 'video_resource_id',
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Resources',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    },
    thumbnailResourceId: {
      field: 'thumbnail_resource_id',
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Resources',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    },
    imageSize: {
      field: 'image_size',
      allowNull: true,
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'videos_thumbnails',
    underscored: true,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false,
    deletedAt: false
  })
}
