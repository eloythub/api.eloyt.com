'use strict'

import debug from 'debug'
import configs from '../../Configs'
import * as Models from '../Models'
import UsersLocationsHistoryRepository from './UsersLocationsHistoryRepository'

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

  static async isUserExists (userId) {
    log('isUserExists')

    const UserLocationCount = await Models.UsersLocations.count({
      where: {userId}
    })

    return UserLocationCount > 0
  }

  static async updateCoordination (userId, lat, lng) {
    log('updateCoordination')

    const [, updatedUserCount] = await Models.sequelize.query(`
      UPDATE users_locations
      SET
        coordination = POINT(:lat, :lng)
      WHERE
        user_id = :userId;
    `, {
      replacements: {
        userId,
        lat,
        lng
      },
      type: Models.sequelize.QueryTypes.UPDATE
    })

    if (updatedUserCount === 0) {
      return false
    }

    await UsersLocationsHistoryRepository.addNewCoordination(userId, lat, lng)

    return true
  }

  static async addNewCoordination (userId, lat, lng) {
    log('addNewCoordination')

    const [, createdUserCount] = await Models.sequelize.query(`
      INSERT INTO users_locations 
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
      return false
    }

    await UsersLocationsHistoryRepository.addNewCoordination(userId, lat, lng)

    return true
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
