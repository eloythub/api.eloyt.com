'use strict'

import Sequelize from 'sequelize'

export default function (sequelize, DataTypes) {
  return sequelize.define('VideosProperties', {
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
    description: {
      field: 'description',
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    tableName: 'videos_properties',
    underscored: true,
    timestamps: false
  })
}
