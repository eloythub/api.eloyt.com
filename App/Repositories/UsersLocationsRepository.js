'use strict'

import debug from 'debug'
import configs from '../../Configs'
import * as Models from '../Models'

const log = debug(`${configs.debugZone}:UsersLocationsRepository`)

export default class UsersLocationsRepository {
  static async fetchUserIdsInRadius (lat, lng, radius, conversionRate) {
    log('fetchUserIdsInRadius')

    const result = await Models.sequelize.query(`
      SELECT 
        string_agg(ul.user_id::TEXT, ',') AS users
      FROM users_locations AS ul
      WHERE st_distancesphere(
                ul.coordination :: GEOMETRY,
                st_makepoint(
                    :lat,
                    :lng
                )
            ) / :conversionRate <= :radius
    `, {
      replacements: {
        lat,
        lng,
        conversionRate,
        radius
      },
      type: Models.sequelize.QueryTypes.SELECT
    })

    const {users} = result.pop()

    if (!users) {
      return []
    }

    return users.toString().split(',')
  }

  static async fetchUserInRadius (lat, lng, radius, conversionRate) {
    log('fetchUserInRadius')

    const users = await Models.sequelize.query(`
      SELECT
        ul.id               AS user_id,
        st_distancesphere(
            ul.coordination :: GEOMETRY,
            st_makepoint(
                :lat,
                :lng
            )
        ) / :conversionRate AS user_distance
      FROM users_locations AS ul
      WHERE st_distancesphere(
                ul.coordination :: GEOMETRY,
                st_makepoint(
                    :lat,
                    :lng
                )
            ) / :conversionRate <= :radius
    `, {
      replacements: {
        lat,
        lng,
        conversionRate,
        radius
      },
      type: Models.sequelize.QueryTypes.SELECT
    })

    if (users.length === 0) {
      return []
    }

    return users
  }
};
