'use strict'

import debug from 'debug'
import configs from '../../Configs'
import MessagesService from '../Services/MessagesService'
import ChatRecipientsService from '../Services/ChatRecipientsService'

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

  static async getRecipients (req, res) {
    const error = debug(`${configs.debugZone}:MessagesController:getRecipients`)

    const {user} = req.auth.credentials

    try {
      const data = await ChatRecipientsService.getRecipients(user.id)

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

  static async getMessages (req, res) {
    const error = debug(`${configs.debugZone}:MessagesController:getMessages`)

    const {user} = req.auth.credentials
    const {guestUserId} = req.params
    const {offset = 0, limit = 25} = req.query

    try {
      const data = await MessagesService.getMessages(user.id, guestUserId, offset, limit)

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

  static async readMessages (req, res) {
    const error = debug(`${configs.debugZone}:MessagesController:readMessages`)

    const {user} = req.auth.credentials
    const {guestUserId} = req.params

    try {
      const [updatedMessages] = await MessagesService.readMessages(user.id, guestUserId)

      res({
        statusCode: 200,
        data: {
          updatedMessages
        }
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
