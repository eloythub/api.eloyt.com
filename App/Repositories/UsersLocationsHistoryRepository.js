'use strict'

import debug from 'debug'
import configs from '../../Configs'
import * as Models from '../Models'

const log = debug(`${configs.debugZone}:UsersLocationsHistoryRepository`)

export default class UsersLocationsHistoryRepository {
  static async addNewCoordination (userId, lat, lng) {
    log('addNewCoordination')

    const [, createdUserCount] = await Models.sequelize.query(`
      INSERT INTO users_locations_history
             (user_id, coordination)
      VALUES (:userId, POINT(:lat, :lng));
    `, {
      replacements: {
        userId,
        lat,
        lng
      },
      type: Models.sequelize.QueryTypes.INSERT
    })

    if (createdUserCount === 0) {
      return null
    }

    return true
  }
};

