'use strict'

import SearchController from '../Controllers/SearchController'
import * as Joi from 'joi'

export default class SearchRoutes {
  static setRoutes (router) {
    router.addRoute({
      method: 'GET',
      path: `/search`,
      config: {
        auth: 'token',
        handler: (req, res) => SearchController.search(req, res),
        validate: {
          params: {
            query: Joi.string()
          }
        }
      }
    })
  }
};
