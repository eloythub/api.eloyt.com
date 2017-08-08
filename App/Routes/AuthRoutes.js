'use strict'

import AuthController from '../Controllers/AuthController'
import * as Joi from 'joi'

export default class AuthRoutes {
  static setRoutes (router) {
    router.addRoute({
      method: 'POST',
      path: `/auth/token/generate`,
      config: {
        handler: (req, res) => AuthController.generateToken(req, res),
        validate: {
          payload: {
            userId: Joi.string().required()
          }
        }
      }
    })

    router.addRoute({
      method: 'GET',
      path: `/auth/token/validate`,
      config: {
        auth: 'token',
        handler: (req, res) => AuthController.validateToken(req, res)
      }
    })
  }
};
