'use strict'

import debug from 'debug'
import configs from '../../Configs'
import FacebookService from '../Services/FacebookService'
import StorageService from '../Services/StorageService'
import AuthRepository from '../Repositories/AuthRepository'
import UsersRepository from '../Repositories/UsersRepository'

export default class UsersService {
  static async getUserByTokenId (tokenId) {
    const log = debug(`${configs.debugZone}:UsersService:getUserByTokenId`)

    log('getUserByTokenId')

    const authToken = await AuthRepository.fetchAuthTokenById(tokenId)

    if (!authToken) {
      return null
    }

    const user = await UsersRepository.fetchUserById(authToken.userId)

    return user
  }

  static async findOrCreateUser (accessToken, facebookUserId) {
    const log = debug(`${configs.debugZone}:UsersService:findOrCreateUser`)

    log('findOrCreateUser')

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
    const log = debug(`${configs.debugZone}:UsersService:updateUserAvatarByFacebookPicture`)

    log('updateUserAvatarByFacebookPicture')

    const profilePicture = await FacebookService.requestProfilePicture(accessToken, facebookUserId)

    const avatarResource = await StorageService.downloadPictureFromFacebookAndUploadToCloud(user.id, profilePicture)

    const updatedUser = await UsersService.updateUser(user.id, {
      avatarResourceId: avatarResource.id
    })

    return updatedUser
  }

  static async createUser (profile) {
    const log = debug(`${configs.debugZone}:UsersService:createUser`)

    log('createUser')

    const {
      id,
      email,
      name,
      first_name: firstName,
      last_name: lastName
    } = profile

    const username = null

    let user = await UsersRepository.createUser(id, email, username, name, firstName, lastName)

    return user
  }

  static async updateUser (userId, attributes) {
    const log = debug(`${configs.debugZone}:UsersService:updateUser`)

    log('updateUser')

    let updatingAttributes = {}

    let selectedUser = await UsersRepository.fetchUserById(userId)

    if ('username' in attributes) {
      attributes.username = attributes.username.replace(/\W/g, '')
    }

    for (let key in attributes) {
      if (attributes[key] !== selectedUser[key]) {
        updatingAttributes[key] = attributes[key] ? attributes[key] : null
      }
    }

    let user = await UsersRepository.updateUser(userId, updatingAttributes)

    return user
  }

  static async findUser (userId) {
    const log = debug(`${configs.debugZone}:UsersService:findUser`)

    log('findUser')

    let user = await UsersRepository.fetchUserById(userId)

    return user
  }

  static async isActivable (userId) {
    const log = debug(`${configs.debugZone}:UsersService:isActivable`)

    log('isActivable')

    let user = await UsersRepository.fetchUserById(userId)

    return (
      user.username &&
      user.firstName &&
      user.lastName &&
      (user.hashtags !== null && user.hashtags.length >= 1 && user.hashtags.length <= 5)
    )
  }
};
