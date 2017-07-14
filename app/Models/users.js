'use strict'

import Sequelize from 'sequelize'

export default function (sequelize, DataTypes) {
  return sequelize.define('Users', {
    id: {
      field: 'id',
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    email: {
      field: 'email',
      allowNull: true,
      type: DataTypes.STRING
    },
    name: {
      field: 'name',
      type: DataTypes.STRING,
      allowNull: true
    },
    mobile: {
      field: 'mobile',
      type: DataTypes.STRING,
      allowNull: true
    },
    firstName: {
      field: 'first_name',
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      field: 'last_name',
      type: DataTypes.STRING,
      allowNull: true
    },
    dateOfBirth: {
      field: 'date_of_birth',
      type: DataTypes.DATE,
      allowNull: true
    },
    gender: {
      field: 'gender',
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true
    },
    avatarResourceId: {
      field: 'avatar_resource_id',
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Resources',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    },
    aboutMe: {
      field: 'about_me',
      type: DataTypes.TEXT,
      allowNull: true
    },
    isActivated: {
      field: 'is_activated',
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    registeredAt: {
      field: 'registered_at',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'users',
    timestamps: false,
    underscored: true
  })
}
