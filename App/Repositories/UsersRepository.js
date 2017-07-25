'use strict'

import debug from 'debug'
import configs from '../../Configs'
import * as Models from '../Models'

export default class UsersRepository {
  static async fetchUserById (id) {
    const log = debug(`${configs.debugZone}:UsersRepository:fetchUserById`)

    log('fetchUserById')

    const user = await Models.Users.findOne({ where: { id } })

    if (!user) {
      return null
    }

    return user.dataValues
  }

  static async fetchUserIdByEmail (email) {
    const log = debug(`${configs.debugZone}:UsersRepository:fetchUserIdByEmail`)

    log('fetchUserIdByEmail')

    const user = await Models.Users.findOne({ where: { email } })

    if (!user) {
      return null
    }

    return user.dataValues
  }

  static async createUser (email, name, firstName, lastName, gender, dateOfBirth) {
    const log = debug(`${configs.debugZone}:UsersRepository:createUser`)

    log('createUser')

    const user = await Models.Users.create({ email, name, firstName, lastName, gender, dateOfBirth })

    if (!user) {
      return null
    }

    return user.dataValues
  }

  static async updateUser (userId, attributes) {
    const log = debug(`${configs.debugZone}:UsersRepository:updateUser`)

    log('updateUser')

    let user = await Models.Users.update(attributes, { where: { id: userId } })

    if (!user) {
      return null
    }

    user = await UsersRepository.fetchUserById(userId)

    return user
  }
};
