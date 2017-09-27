'use strict'

import Sequelize from 'sequelize'
import MessageTypesEnum from '../Enums/MessageTypesEnum'

export default function (sequelize, DataTypes) {
  return sequelize.define('Messages', {
    id: {
      field: 'id',
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    senderUserId: {
      field: 'sender_user_id',
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    },
    receiverUserId: {
      field: 'receiver_user_id',
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    },
    type: {
      field: 'type',
      type: DataTypes.ENUM(
        MessageTypesEnum.text,
        MessageTypesEnum.video,
        MessageTypesEnum.image
      ),
      allowNull: false
    },
    message: {
      field: 'message',
      allowNull: false,
      type: DataTypes.STRING
    },
    sentAt: {
      field: 'sent_at',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    seenAt: {
      field: 'seen_at',
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'messages',
    underscored: true,
    timestamps: true,
    createdAt: 'sentAt',
    updatedAt: false,
    deletedAt: false
  })
}
