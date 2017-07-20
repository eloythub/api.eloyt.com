'use strict'

import FacebookService from '../Services/FacebookService'
import StorageService from '../Services/StorageService'
import AuthRepository from '../Repositories/AuthRepository'
import UsersRepository from '../Repositories/UsersRepository'

export default class UsersService {
  static async getUserByTokenId (tokenId) {
    const authToken = await AuthRepository.fetchAuthTokenById(tokenId)

    const user = await UsersRepository.fetchUserById(authToken.userId)

    return user
  }

  static async findOrCreateUser (accessToken, facebookUserId) {
    const profile = await FacebookService.requestProfile(accessToken, facebookUserId)

    let user = await UsersRepository.fetchUserIdByEmail(profile.email)

    if (!user) {
      user = await UsersService.createUser(profile)

      user = await UsersService.updateUserAvatarByFacebookPicture(accessToken, facebookUserId, user)

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

  static async updateUserAvatarByFacebookPicture (accessToken, facebookUserId, user) {
    const profilePicture = await FacebookService.requestProfilePicture(accessToken, facebookUserId)

    const avatarResource = await StorageService.downloadPictureFromFacebookAndUploadToCloud(user.id, profilePicture)

    const updatedUser = await UsersService.updateUser(user.id, {
      avatarResourceId: avatarResource.id
    })

    return updatedUser
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

  static async updateUser (userId, attributes) {
    let user = await UsersRepository.updateUser(userId, attributes)

    return user
  }

  static async findUser (userId) {
    let user = await UsersRepository.fetchUserById(userId)

    return user
  }
};
