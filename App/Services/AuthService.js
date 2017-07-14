'use strict'

import AuthRepository from '../Repositories/AuthRepository'

export default class AuthService {
  static async generateTokenByUserId (userId) {
    let tokenId = await AuthRepository.getTokenIdByUserId(userId)

    if (tokenId) {
      return tokenId
    }

    tokenId = await AuthRepository.createTokenId(userId)

    return tokenId
  }
};
