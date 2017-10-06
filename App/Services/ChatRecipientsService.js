'use strict'

import debug from 'debug'
import configs from '../../Configs'
import ChatRecipientsRepository from '../Repositories/ChatRecipientsRepository'

export default class ChatRecipientsService {
  static async addNewRecipients (userId1, userId2) {
    const log = debug(`${configs.debugZone}:ChatRecipientsService:addNewRecipients`)

    const chatRecipients = await ChatRecipientsRepository.addNewRecipients(userId1, userId2)

    return chatRecipients
  }
};
