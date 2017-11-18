'use strict'

import LocationController from '../Controllers/LocationController'
import * as Joi from 'joi'

export default class LocationRoutes {
  static setRoutes (router) {
    router.addRoute({
      method: 'PATCH',
      path: `/location`,
      config: {
        auth: 'token',
        handler: (req, res) => LocationController.update(req, res),
        validate: {
          payload: {
            lat: Joi.number().required(),
            lng: Joi.number().required()
          }
        }
      }
    })
  }
};
