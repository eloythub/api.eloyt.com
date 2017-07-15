'use strict'

import * as Model from '../../../App/Models'
import GendersEnum from '../../../App/Enums/GendersEnum'
import FacebookFixture from './FacebookFixture'

export default class AuthFixture {
  static mockedUser = {
    id: 'edc08f41-8a6a-40fc-a0c2-fc1283677eef',
    email: FacebookFixture.mockedFacebookProfile.email,
    gender: GendersEnum.other,
  }

  static mockedAuthToken = {
    id: '0bc8b13c-68b5-11e7-907b-a6006ad3dba0',
    userId: 'edc08f41-8a6a-40fc-a0c2-fc1283677eef',
  }

  static mockedRegisteredUser = {
    email: FacebookFixture.mockedFacebookProfile.email,
    name: null,
    firstName: null,
    lastName: null,
    gender: GendersEnum.other,
    mobile: null,
    aboutMe: null,
    avatarResourceId: null,
    dateOfBirth: null,
    isActivated: false,
  }

  static mockedRegisteredFacebookUser = {
    email: FacebookFixture.mockedFacebookProfile.email,
    name: FacebookFixture.mockedFacebookProfile.name,
    firstName: FacebookFixture.mockedFacebookProfile.first_name,
    lastName: FacebookFixture.mockedFacebookProfile.last_name,
    gender: FacebookFixture.mockedFacebookProfile.gender,
    mobile: null,
    aboutMe: null,
    avatarResourceId: null,
    dateOfBirth: "1992-08-08",
    isActivated: false,
  }

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
