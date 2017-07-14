'use strict'

import * as Models from '../Models'

export default class AuthRepository {
  static async getTokenIdByUserId (userId) {
    const authToken = await Models.AuthTokens.findById(userId)

    if (!authToken) {
      return null
    }

    return authToken.id
  }

  static async createTokenId (userId) {
    const authToken = await Models.AuthTokens.create({
      userId
    })

    return authToken.dataValues.id
  }
}
