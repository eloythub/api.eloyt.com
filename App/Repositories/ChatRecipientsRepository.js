'use strict'

import debug from 'debug'
import configs from '../../Configs'
import * as Models from '../Models'

const log = debug(`${configs.debugZone}:ChatRecipientsRepository`)

export default class ChatRecipientsRepository {
  static async fetchGuestUsers (hostUserId) {
    log('fetchGuestUsers')

    const ProducedMap = {
      'user_facebook_id': 'facebookId',
      'user_id': 'id',
      'user_username': 'username',
      'user_name': 'name',
      'user_email': 'email',
      'user_firstname': 'firstName',
      'user_lastname': 'lastName',
      'user_gender': 'gender',
      'user_mobile': 'mobile',
      'user_date_of_birth': 'dateOfBirth',
      'user_is_activated': 'isActivated',
      'user_about_me': 'aboutMe',
      'cloud_avatar_url': 'cloudAvatarUrl',
      'user_registered_at': 'registeredAt',
      'user_updated_at': 'updatedAt',
      'user_hashtags': 'hashtags'
    }

    const users = await Models.sequelize.query(`
      SELECT
        u.facebook_id   AS user_facebook_id,
        u.id            AS user_id,
        u.username      AS user_username,
        u.name          AS user_name,
        u.email         AS user_email,
        u.first_name    AS user_firstname,
        u.last_name     AS user_lastname,
        u.gender        AS user_gender,
        u.mobile        AS user_mobile,
        u.date_of_birth AS user_date_of_birth,
        u.is_activated  AS user_is_activated,
        u.about_me      AS user_about_me,
        ar.cloud_url    AS cloud_avatar_url,
        u.registered_at AS user_registered_at,
        u.updated_at    AS user_updated_at,
        (
          SELECT array_to_json(array_agg(h)) AS hashtags
          FROM users_hashtags AS uh
            JOIN hashtags AS h
              ON uh.hashtag_id = h.id
          WHERE
            uh.user_id = u.id
        )               AS user_hashtags
      FROM chat_recipients AS cr
        LEFT JOIN users AS u
          ON u.id = cr.guest_user_id
        LEFT JOIN resources AS ar
          ON ar.id = u.avatar_resource_id
      WHERE
        cr.host_user_id=:hostUserId
      ORDER BY 
        cr.last_message_at DESC, cr.sent_at DESC
    `, {
      replacements: {
        hostUserId
      },
      fieldMap: ProducedMap,
      type: Models.sequelize.QueryTypes.SELECT
    })

    if (users.length === 0) {
      return []
    }

    return users
  }

  static async fetchOneByUsers (hostUserId, guestUserId) {
    log('fetchReactByAttributes')

    const chatRecipients = await Models.ChatRecipients.findOne({ where: {hostUserId, guestUserId} })

    if (!chatRecipients) {
      return null
    }

    return chatRecipients.dataValues
  }

  static async addNewRecipients (userId1, userId2) {
    log('addNewRecipients')

    // add new recipients relationship for host person
    await this.create(userId1, userId2)

    // add new recipients relationship for guest person
    await this.create(userId2, userId1)

    return true
  }

  static async create (hostUserId, guestUserId) {
    log('create')

    const isRecipientsExists = await this.isRecipientsExists(hostUserId, guestUserId)

    let chatRecipients

    if (isRecipientsExists) {
      chatRecipients = await this.fetchOneByUsers(hostUserId, guestUserId)

      return chatRecipients
    }

    chatRecipients = await Models.ChatRecipients.create({
      hostUserId,
      guestUserId
    })

    if (!chatRecipients) {
      return null
    }

    return chatRecipients.dataValues
  }

  static async isRecipientsExists (hostUserId, guestUserId) {
    log('isRecipientsExists')

    const chatRecipients = await Models.ChatRecipients.count({ where: {hostUserId, guestUserId} })

    if (!chatRecipients) {
      return null
    }

    return chatRecipients > 0
  }

  static async updateLastMessage (hostUserId, guestUserId, message) {
    log('updateLastMessage')

    const chatRecipients = await Models.ChatRecipients.update({
      lastMessageId: message.id,
      lastMessageAt: message.sentAt
    }, {
      where: {hostUserId, guestUserId}
    })

    if (!chatRecipients) {
      return null
    }

    return chatRecipients[0] > 0
  }

  static async isRelationshipExists (userId1, userId2) {
    log('isRelationshipExists')

    const ProducedMap = {
      'chat_recipients_count': 'count',
    }

    const chatRecipients = await Models.sequelize.query(`
      SELECT
        count(cr.id) AS chat_recipients_count
      FROM chat_recipients AS cr
      WHERE
        (
          host_user_id = :userId1 AND
          guest_user_id = :userId2 
        ) OR (
          host_user_id = :userId2 AND
          guest_user_id = :userId1
        )
      OFFSET 0
      LIMIT 1
    `, {
      replacements: {
        userId1,
        userId2
      },
      fieldMap: ProducedMap,
      type: Models.sequelize.QueryTypes.SELECT
    })

    return chatRecipients[0].count > 0
  }
};
