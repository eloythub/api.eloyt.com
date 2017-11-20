'use strict'

import debug from 'debug'
import configs from '../../Configs'
import LocationService from '../Services/LocationService'

const error = debug(`${configs.debugZone}:LocationController`)

export default class LocationController {
  static async update (req, res) {

    const {user} = req.auth.credentials
    const {lat, lng} = req.payload

    try {
      const isUpdated = await LocationService.updateNewLocation(user.id, lat, lng)

      res({
        statusCode: 200,
        data: {
          isUpdated
        }
      }).code(200)
    } catch (err) {
      error(err.message)

      res({
        statusCode: 500,
        error: err.message,
        err
      }).code(500)
    }
  }
};
