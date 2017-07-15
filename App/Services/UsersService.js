'use strict'

import FacebookService from '../Services/FacebookService'
import AuthRepository from '../Repositories/AuthRepository'
import UsersRepository from '../Repositories/UsersRepository'

export default class UsersService {
  static async getUserByTokenId (tokenId) {
    const authToken = await AuthRepository.fetchAuthTokenById(tokenId)

    const user = await UsersRepository.fetchUserIdById(authToken.userId)

    return user
  }

  static async findOrCreateUser (accessToken, facebookUserId) {
    const profile = await FacebookService.requestProfile(accessToken, facebookUserId)
    // const profilePicture = await FacebookService.requestProfilePicture(accessToken, facebookUserId)

    let user = await UsersRepository.fetchUserIdByEmail(profile.email)

    if (!user) {
      user = await UsersService.createUser(profile)

      return {
        action: 'create',
        data: user
      }
    }

    return {
      action: 'find',
      data: user
    }
  }

  static async createUser (profile) {
    const {
      email,
      name,
      first_name: firstName,
      last_name: lastName,
      gender,
      birthday: dateOfBirth
    } = profile

    let user = await UsersRepository.createUser(email, name, firstName, lastName, gender, dateOfBirth)

    return user
  }
};
