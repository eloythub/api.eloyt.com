'use strict'

import debug from 'debug'
import configs from '../../Configs'
import * as Models from '../Models'

export default class MessagesRepository {
  static async newMessage (senderUserId, receiverUserId, type, message) {
    const log = debug(`${configs.debugZone}:MessagesRepository:newMessage`)

    log('newMessage')

    let user = await Models.Messages.create({
      senderUserId,
      receiverUserId,
      type,
      message
    })

    if (!user) {
      return null
    }

    return user
  }
};
