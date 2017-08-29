'use strict'

import HashtagsController from '../Controllers/HashtagsController'
import * as Joi from 'joi'

export default class UsersRoutes {
  static setRoutes (router) {
    router.addRoute({
      method: 'GET',
      path: `/hashtags`,
      config: {
        auth: 'token',
        handler: (req, res) => HashtagsController.getHashtags(req, res)
      }
    })

    router.addRoute({
      method: 'POST',
      path: `/hashtags/update/user`,
      config: {
        auth: 'token',
        handler: (req, res) => HashtagsController.updateUserHashtags(req, res),
        validate: {
          payload: {
            ids: Joi.alternatives().try(
              Joi.string(),
              Joi.array()
                .items(Joi.string())
                .min(1)
                .max(5)
                .unique()
                .required()
            ).required()
          }
        }
      }
    })
  }
};
