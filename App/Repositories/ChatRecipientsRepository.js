'use strict'

import debug from 'debug'
import configs from '../../Configs'
import * as Models from '../Models'

export default class ChatRecipientsRepository {
  static async fetchOneByUsers (hostUserId, guestUserId) {
    const log = debug(`${configs.debugZone}:ReactRepository:fetchReactByAttributes`)

    log('fetchReactByAttributes')

    const chatRecipients = await Models.ChatRecipients.findOne({ where: {hostUserId, guestUserId} })

    if (!chatRecipients) {
      return null
    }

    return chatRecipients.dataValues
  }

  static async addNewRecipients (userId1, userId2) {
    const log = debug(`${configs.debugZone}:ChatRecipientsRepository`)

    log('addNewRecipients')

    // add new recipients relationship for host person
    await this.create(userId1, userId2)

    // add new recipients relationship for guest person
    await this.create(userId2, userId1)

    return true
  }

  static async create (hostUserId, guestUserId) {
    const log = debug(`${configs.debugZone}:ChatRecipientsRepository`)

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
    const log = debug(`${configs.debugZone}:ChatRecipientsRepository`)

    log('isRecipientsExists')

    const chatRecipients = await Models.ChatRecipients.count({ where: {hostUserId, guestUserId} })

    if (!chatRecipients) {
      return null
    }

    return chatRecipients > 0
  }

  static async isRelationshipExists (userId1, userId2) {
    const log = debug(`${configs.debugZone}:ChatRecipientsRepository`)

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
