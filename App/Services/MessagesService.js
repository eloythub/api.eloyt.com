'use strict'

import debug from 'debug'
import configs from '../../Configs'
import ComService from '../Services/ComService'
import ChatRecipientsService from '../Services/ChatRecipientsService'
import MessagesRepository from '../Repositories/MessagesRepository'
import MessageTypesEnum from '../Enums/MessageTypesEnum'

const log = debug(`${configs.debugZone}:MessagesService`)

export default class MessagesService {
  static async newMessage (senderUserId, receiverUserId, type, message) {
    log('newMessage')

    let resultData

    switch (type) {
      case MessageTypesEnum.text:
        resultData = await this.newTextMessage(senderUserId, receiverUserId, message)
        break
      default:
        throw new Error('this feature has not implemented yet')
    }

    return resultData
  }

  static async newTextMessage (senderUserId, receiverUserId, message) {
    log('newTextMessage')

    const resultData = await MessagesRepository.newMessage(senderUserId, receiverUserId, MessageTypesEnum.text, message)

    await ChatRecipientsService.updateLastMessage(receiverUserId, senderUserId, resultData)

    try {
      console.log(senderUserId, receiverUserId, resultData)

      const pushNotificationSummary = await ComService.directMessageToUser(senderUserId, receiverUserId, resultData)

      log(pushNotificationSummary)
    } catch (err) {
      log(err.message)
      // TODO: check if message has failed delete the message and return exception
    }

    return resultData
  }

  static async getMessages (hostUserId, guestUserId, offset, limit) {
    log('getMessages')

    const messages = await MessagesRepository.fetchMessages(hostUserId, guestUserId, offset, limit)

    return messages
  }

  static async readMessages(hostUserId, guestUserId) {
    log('getMessages')

    const messages = await MessagesRepository.readMessages(hostUserId, guestUserId)

    return messages
  }
};
