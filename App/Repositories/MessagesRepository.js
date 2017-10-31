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

    return this.fetchMessageById(messageObj.dataValues.id)
  }

  static async fetchMessages (hostUserId, guestUserId, offset, limit) {
    log('fetchMessages')

    const ProducedMap = {
      'message_id': 'id',
      'message_message': 'message',
      'message_type': 'type',
      'message_sent_at': 'sendAt',
      'message_seen_at': 'seenAt',
      'message_sender_user': 'senderUser',
      'message_receiver_user': 'receiverUser',
    }

    const messages = await Models.sequelize.query(`
      SELECT
        m.id                AS message_id,
        m.message           AS message_message,
        m.type              AS message_type,
        m.sent_at           AS message_sent_at,
        m.seen_at           AS message_seen_at,
        (
        
          SELECT row_to_json(isu)
          FROM
           (
              SELECT
                su.id           AS id,
                su.is_activated AS is_activated,
                su.gender       AS gender,
                su.email        AS email,
                su.first_name   AS first_name,
                su.last_name    AS last_name,
                su.username     AS username,
                r.cloud_url     AS cloud_avatar_url
              FROM users AS su
                LEFT JOIN resources AS r
                  ON r.id = su.avatar_resource_id 
              WHERE
                su.id = m.sender_user_id
           ) AS isu

        )                   AS message_sender_user,
        (
        
          SELECT row_to_json(isu)
          FROM
           (
              SELECT
                su.id           AS id,
                su.is_activated AS is_activated,
                su.gender       AS gender,
                su.email        AS email,
                su.first_name   AS first_name,
                su.last_name    AS last_name,
                su.username     AS username,
                r.cloud_url     AS cloud_avatar_url
              FROM users AS su
                LEFT JOIN resources AS r
                  ON r.id = su.avatar_resource_id 
              WHERE
                su.id = m.receiver_user_id
           ) AS isu
                      
        )                   AS message_receiver_user
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

    return messages
  }

  static async fetchMessageById (messageId) {
    log('fetchMessages')

    const ProducedMap = {
      'message_id': 'id',
      'message_message': 'message',
      'message_type': 'type',
      'message_sent_at': 'sendAt',
      'message_seen_at': 'seenAt',
      'message_sender_user': 'senderUser',
      'message_receiver_user': 'receiverUser',
    }

    const messages = await Models.sequelize.query(`
      SELECT
        m.id                AS message_id,
        m.message           AS message_message,
        m.type              AS message_type,
        m.sent_at           AS message_sent_at,
        m.seen_at           AS message_seen_at,
        (
        
          SELECT row_to_json(isu)
          FROM
           (
              SELECT
                su.id           AS id,
                su.is_activated AS is_activated,
                su.gender       AS gender,
                su.email        AS email,
                su.first_name   AS first_name,
                su.last_name    AS last_name,
                su.username     AS username,
                r.cloud_url     AS cloud_avatar_url
              FROM users AS su
                LEFT JOIN resources AS r
                  ON r.id = su.avatar_resource_id 
              WHERE
                su.id = m.sender_user_id
           ) AS isu

        )                   AS message_sender_user,
        (
        
          SELECT row_to_json(isu)
          FROM
           (
              SELECT
                su.id           AS id,
                su.is_activated AS is_activated,
                su.gender       AS gender,
                su.email        AS email,
                su.first_name   AS first_name,
                su.last_name    AS last_name,
                su.username     AS username,
                r.cloud_url     AS cloud_avatar_url
              FROM users AS su
                LEFT JOIN resources AS r
                  ON r.id = su.avatar_resource_id 
              WHERE
                su.id = m.receiver_user_id
           ) AS isu
                      
        )                   AS message_receiver_user
      FROM messages AS m
      WHERE
        m.id = :messageId
    `, {
      replacements: {
        messageId
      },
      fieldMap: ProducedMap,
      type: Models.sequelize.QueryTypes.SELECT
    })

    if (messages.length === 0) {
      return null
    }

    return messages[0]
  }
};
