'use strict'

import MessageTypesEnum from '../Enums/MessageTypesEnum'
import MessagesController from '../Controllers/MessagesController'
import * as Joi from 'joi'

export default class MessagesRoutes {
  static setRoutes (router) {
    router.addRoute({
      method: 'GET',
      path: `/messages/recipients`,
      config: {
        auth: 'token',
        handler: (req, res) => MessagesController.getRecipients(req, res)
      }
    })

    router.addRoute({
      method: 'GET',
      path: `/messages/{guestUserId}`,
      config: {
        auth: 'token',
        handler: (req, res) => MessagesController.getMessages(req, res),
        validate: {
          params: {
            guestUserId: Joi.string().required(),
          },
          query: {
            offset: Joi.number().integer(),
            limit: Joi.number().integer()
          }
        }
      }
    })

    router.addRoute({
      method: 'POST',
      path: `/messages/{guestUserId}/read`,
      config: {
        auth: 'token',
        handler: (req, res) => MessagesController.readMessages(req, res),
        validate: {
          params: {
            guestUserId: Joi.string().required(),
          }
        }
      }
    })

    router.addRoute({
      method: 'POST',
      path: `/messages/send`,
      config: {
        auth: 'token',
        handler: (req, res) => MessagesController.sendMessage(req, res),
        validate: {
          payload: {
            receiverUserId: Joi.string().required(),
            type: Joi.string().allow([
              MessageTypesEnum.text,
              MessageTypesEnum.image,
              MessageTypesEnum.video
            ]).required(),
            message: Joi.string().required()
          }
        }
      }
    })
  }
};
