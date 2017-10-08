'use strict'

import debug from 'debug'
import configs from '../../Configs'
import * as Models from '../Models'

const log = debug(`${configs.debugZone}:MessagesRepository`)

export default class MessagesRepository {
  static async newMessage (senderUserId, receiverUserId, type, message) {
    log('newMessage')

    let messageObj = await Models.Messages.create({
      senderUserId,
      receiverUserId,
      type,
      message,
      seenAt: null
    })

    if (!messageObj) {
      return null
    }

    return messageObj.dataValues
  }

  static async fetchMessages (hostUserId, guestUserId, offset, limit) {
    log('fetchMessages')

    const ProducedMap = {
      'message_sender_user_id': 'senderUserId',
      'message_receiver_user_id': 'receiverUserId',
      'message_message': 'message',
      'message_type': 'type',
      'message_sent_at': 'sendAt',
      'message_seen_at': 'seenAt',
    }

    const users = await Models.sequelize.query(`
      SELECT
        m.sender_user_id    AS message_sender_user_id,
        m.receiver_user_id  AS message_receiver_user_id,
        m.message           AS message_message,
        m.type              AS message_type,
        m.sent_at           AS message_sent_at,
        m.seen_at           AS message_seen_at
      FROM messages AS m
      WHERE
        (
          m.sender_user_id = :hostUserId AND
          m.receiver_user_id = :guestUserId
        ) OR
        (
          m.sender_user_id = :guestUserId AND
          m.receiver_user_id = :hostUserId
        )
      ORDER BY 
        m.sent_at DESC
      OFFSET :offset
      LIMIT :limit
    `, {
      replacements: {
        hostUserId,
        guestUserId,
        offset,
        limit
      },
      fieldMap: ProducedMap,
      type: Models.sequelize.QueryTypes.SELECT
    })

    return users
  }
};
