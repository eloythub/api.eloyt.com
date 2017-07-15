'use strict'

import UserController from '../Controllers/UsersController'

const Joi = require('joi')

export default class UsersRoutes {
  static setRoutes (router, prefix) {
    router.addRoute({
      method: 'PUT',
      path: `/${prefix}/create-or-get`,
      config: {
        handler: (req, res) => UserController.createOrGet(req, res),
        validate: {
          payload: {
            token: Joi.string()
          }
        }
      }
    })

    router.addRoute({
      method: 'POST',
      path: `/${prefix}/profile-update`,
      config: {
        auth: 'token',
        handler: (req, res) => UserController.profileUpdate(req, res)
      }
    })

    router.addRoute({
      method: 'GET',
      path: `/${prefix}/{userId}`,
      config: {
        auth: 'token',
        handler: (req, res) => UserController.getProfile(req, res),
        validate: {
          params: {
            userId: Joi.string()
          }
        }
      }
    })
  }
};
