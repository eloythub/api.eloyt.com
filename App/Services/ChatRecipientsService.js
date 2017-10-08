'use strict'

import debug from 'debug'
import configs from '../../Configs'
import ChatRecipientsRepository from '../Repositories/ChatRecipientsRepository'

const log = debug(`${configs.debugZone}:ChatRecipientsService`)

export default class ChatRecipientsService {
  static async addNewRecipients (userId1, userId2) {
    log('addNewRecipients')

    const chatRecipients = await ChatRecipientsRepository.addNewRecipients(userId1, userId2)

    return chatRecipients
  }

  static async updateLastMessage (hostUserId, guestUserId, message) {
    log('updateLastMessage')

    const chatRecipients = await ChatRecipientsRepository.updateLastMessage(hostUserId, guestUserId, message)

    return chatRecipients
  }

  static async getRecipients (hostUserId) {
    log('getRecipients')

    const chatRecipients = await ChatRecipientsRepository.fetchGuestUsers(hostUserId)

    return chatRecipients
  }
};
