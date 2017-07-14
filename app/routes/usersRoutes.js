'use strict'

import UserController from '../controllers/usersController'

const Joi = require('joi')

export default class UsersRoutes {
  static setRoutes (router, prefix) {
    router.addRoute({
      method: 'PUT',
      path: `/${prefix}/create-or-get`,
      handler: (req, res) => UserController.createOrGet(req, res)
    })

    router.addRoute({
      method: 'POST',
      path: `/${prefix}/profile-update`,
      handler: (req, res) => UserController.profileUpdate(req, res)
    })

    router.addRoute({
      method: 'GET',
      path: `/${prefix}/{userId}`,
      config: {
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
