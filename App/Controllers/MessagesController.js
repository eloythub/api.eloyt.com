'use strict'

import debug from 'debug'
import configs from '../../Configs'
import MessagesService from '../Services/MessagesService'

export default class MessagesController {
  static async sendMessage (req, res) {
    const error = debug(`${configs.debugZone}:MessagesController:sendMessage`)

    const {user} = req.auth.credentials
    const {receiverUserId, type, message} = req.payload

    try {
      const data = await MessagesService.newMessage(user.id, receiverUserId, type, message)

      res({
        statusCode: 200,
        data
      }).code(200)
    } catch (e) {
      error(e.message)

      res({
        statusCode: 500,
        error: e.message
      }).code(500)
    }
  }
};
