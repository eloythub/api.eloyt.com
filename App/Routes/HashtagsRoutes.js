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
        handler: (req, res) => HashtagsController.getHashtags(req, res),
      }
    })
  }
};
