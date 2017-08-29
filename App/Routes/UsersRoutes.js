'use strict'

import UserController from '../Controllers/UsersController'
import * as Joi from 'joi'

export default class UsersRoutes {
  static setRoutes (router) {
    router.addRoute({
      method: 'PUT',
      path: `/users/create-or-get`,
      config: {
        handler: (req, res) => UserController.createOrGet(req, res),
        validate: {
          payload: {
            accessToken: Joi.string().required(),
            facebookUserId: Joi.string().required()
          }
        }
      }
    })

    router.addRoute({
      method: 'POST',
      path: `/users/profile-update`,
      config: {
        auth: 'token',
        handler: (req, res) => UserController.profileUpdate(req, res),
        validate: {
          payload: {
            attributes: Joi.object()
              .keys({
                name: Joi.string().required(),
                username: Joi.string().required(),
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                gender: Joi.string().required(),
                aboutMe: Joi.string().required(),
                mobile: Joi.string().required(),
                dateOfBirth: Joi.string().required()
              })
              .optionalKeys('name', 'username', 'firstName', 'lastName', 'gender', 'aboutMe', 'mobile', 'dateOfBirth')
              .min(1)
              .required()
          }
        }
      }
    })

    router.addRoute({
      method: 'GET',
      path: `/users/{userId}`,
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

    router.addRoute({
      method: 'POST',
      path: `/users/activate`,
      config: {
        auth: 'token',
        handler: (req, res) => UserController.profileActivation(req, res)
      }
    })
  }
};
