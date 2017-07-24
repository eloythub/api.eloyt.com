'use strict'

import Sequelize from 'sequelize'

export default function (sequelize, DataTypes) {
  return sequelize.define('VideosHashtags', {
    id: {
      field: 'id',
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    hashtagId: {
      field: 'hashtag_id',
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Hashtags',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
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
    }
  }, {
    tableName: 'videos_hashtags',
    underscored: true,
    timestamps: false
  })
}
