'use strict'

import AuthController from '../Controllers/AuthController'
import Joi from 'joi'

export default class AuthRoutes {
  static setRoutes (router, prefix) {
    router.addRoute({
      method: 'POST',
      path: `/${prefix}/token/generate`,
      config: {
        handler: (req, res) => AuthController.generateToken(req, res),
        validate: {
          payload: {
            userId: Joi.string()
          }
        }
      }
    })
  }
};
