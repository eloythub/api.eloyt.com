'use strict'

import * as Models from '../Models'

export default class UsersRepository {
  static async fetchUserIdById (id) {
    const user = await Models.Users.findOne({ where: { id } })

    if (!user) {
      return null
    }

    return user.dataValues
  }

  static async fetchUserIdByEmail (email) {
    const user = await Models.Users.findOne({ where: { email } })

    if (!user) {
      return null
    }

    return user.dataValues
  }

  static async createUser (email, name, firstName, lastName, gender, dateOfBirth) {
    const user = await Models.Users.create({ email, name, firstName, lastName, gender, dateOfBirth })

    if (!user) {
      return null
    }

    return user.dataValues
  }

  static async updateUser (userId, attributes) {
    const user = await Models.Users.update(attributes, { where: { id: userId } })

    if (!user) {
      return null
    }

    return user.dataValues
  }
};
