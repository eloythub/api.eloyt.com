'use strict'

import MessageTypesEnum from '../Enums/MessageTypesEnum'
import MessagesController from '../Controllers/MessagesController'
import * as Joi from 'joi'

export default class MessagesRoutes {
  static setRoutes (router) {
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
