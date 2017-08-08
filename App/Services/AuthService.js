'use strict'

import debug from 'debug'
import configs from '../../Configs'
import AuthRepository from '../Repositories/AuthRepository'

export default class AuthService {
  static async generateTokenByUserId (userId) {
    const log = debug(`${configs.debugZone}:AuthService:generateTokenByUserId`)

    log('generateTokenByUserId')

    let tokenId = await AuthRepository.fetchTokenIdByUserId(userId)

    if (tokenId) {
      return tokenId
    }

    tokenId = await AuthRepository.createTokenId(userId)

    return tokenId
  }
};
