'use strict'

import debug from 'debug'
import configs from '../../Configs'
import UsersLocationsRepository from '../Repositories/UsersLocationsRepository'

const log = debug(`${configs.debugZone}:HashtagsService`)

export default class LocationService {
  static async updateNewLocation (userId, lat, lng) {
    log('updateNewLocation')

    // validate hashtags
    const isUserExists = await UsersLocationsRepository.isUserExists(userId)

    if (isUserExists) {
      // update user's location
      return await UsersLocationsRepository.updateCoordination(userId, lat, lng)
    }

    return await UsersLocationsRepository.addNewCoordination(userId, lat, lng)
  }
}
