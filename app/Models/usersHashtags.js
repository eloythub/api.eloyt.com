'use strict'

import Sequelize from 'sequelize'

export default function (sequelize, DataTypes) {
  return sequelize.define('UsersHashtags', {
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
    userId: {
      field: 'user_id',
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    }
  }, {
    tableName: 'users_hashtags',
    timestamps: false,
    underscored: true
  })
}
