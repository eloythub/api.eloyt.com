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
};
