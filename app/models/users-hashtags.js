'use strict';

import Sequelize from 'sequelize';

export default function (sequelize, DataTypes) {
  return sequelize.define("usersHashtags", {
    hashtagId: {
      field: 'hashtag_id',
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'hashtags',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    userId: {
      field: 'user_id',
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
  }, {
    tableName: 'users_hashtags'
  });
}
