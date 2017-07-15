'use strict'

import * as Model from '../../../App/Models'
import GendersEnum from '../../../App/Enums/GendersEnum'

export default class AuthFixture {
  static mockedUser = {
    id: 'edc08f41-8a6a-40fc-a0c2-fc1283677eef',
    email: 'test@test.com',
    gender: GendersEnum.other,
  }

  static mockedAuthToken = {
    id: '0bc8b13c-68b5-11e7-907b-a6006ad3dba0',
    userId: 'edc08f41-8a6a-40fc-a0c2-fc1283677eef',
  }

  static mockedFacebookTokenId = '1234567890'

  static async cleanUp () {
    await Model.AuthTokens.destroy({ where: {} })
    await Model.Users.destroy({ where: {} })
  }

  static async generateTokenSeeder () {
    await Model.Users.create(AuthFixture.mockedUser)
  }

  static async authenticationSeeder () {
    await Model.Users.create(AuthFixture.mockedUser)
    await Model.AuthTokens.create(AuthFixture.mockedAuthToken)
  }
}
