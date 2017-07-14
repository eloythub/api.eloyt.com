'use strict'

import Sequelize from 'sequelize'

export default function (sequelize, DataTypes) {
  return sequelize.define('videosThumbnails', {
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
        model: 'resources',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    },
    thumbnailResourceId: {
      field: 'thumbnail_resource_id',
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'resources',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    },
    imageSize: {
      field: 'image_size',
      allowNull: false,
      type: DataTypes.INTEGER
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'videos_thumbnails',
    timestamps: false,
    underscored: true
  })
}
