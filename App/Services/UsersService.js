'use strict'

import AuthRepository from '../Repositories/AuthRepository'
import UsersRepository from '../Repositories/UsersRepository'

export default class UsersService {
  static async getUserByTokenId (tokenId) {
    const authToken = await AuthRepository.fetchAuthTokenById(tokenId)

    const user = await UsersRepository.fetchUserIdById(authToken.userId)

    return user
  }
};
