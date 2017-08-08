'use strict'

import debug from 'debug'
import configs from '../../Configs'
import * as Models from '../Models'

export default class AuthRepository {
  static async fetchTokenIdByUserId (userId) {
    const log = debug(`${configs.debugZone}:UsersRepository:fetchTokenIdByUserId`)

    log('fetchTokenIdByUserId')

    const authToken = await Models.AuthTokens.findOne({ where: { userId } })

    if (!authToken) {
      return null
    }

    return authToken.id
  }

  static async fetchAuthTokenById (id) {
    const log = debug(`${configs.debugZone}:UsersRepository:fetchAuthTokenById`)

    log('fetchAuthTokenById')

    const authToken = await Models.AuthTokens.findOne({ where: { id } })

    if (!authToken) {
      return null
    }

    return authToken.dataValues
  }

  static async createTokenId (userId) {
    const log = debug(`${configs.debugZone}:UsersRepository:createTokenId`)

    log('createTokenId')

    const authToken = await Models.AuthTokens.create({
      userId
    })

    return authToken.dataValues.id
  }
}
