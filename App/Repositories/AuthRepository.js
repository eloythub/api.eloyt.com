'use strict'

import * as Models from '../Models'

export default class AuthRepository {
  static async fetchTokenIdByUserId (userId) {
    const authToken = await Models.AuthTokens.findOne({ where: { userId } })

    if (!authToken) {
      return null
    }

    return authToken.id
  }

  static async fetchAuthTokenById (id) {
    const authToken = await Models.AuthTokens.findOne({ where: { id } })

    if (!authToken) {
      return null
    }

    return authToken.dataValues
  }

  static async createTokenId (userId) {
    const authToken = await Models.AuthTokens.create({
      userId
    })

    return authToken.dataValues.id
  }
}
