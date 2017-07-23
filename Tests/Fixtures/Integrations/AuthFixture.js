'use strict'

import * as Model from '../../../App/Models'
import GendersEnum from '../../../App/Enums/GendersEnum'
import ResourceTypesEnum from '../../../App/Enums/ResourceTypesEnum'
import ReactTypesEnum from '../../../App/Enums/ReactTypesEnum'
import FacebookFixture from './FacebookFixture'

export default class AuthFixture {
  static mockedUser = {
    id: 'edc08f41-8a6a-40fc-a0c2-fc1283677eef',
    email: FacebookFixture.mockedFacebookProfile.email,
    gender: GendersEnum.other,
  }

  static mockedUser1 = {
    id: '923555fa-f5aa-4fdb-9835-e8f2334043c4',
    email: 'mocked-user@test.com',
    gender: GendersEnum.male,
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

  static mockedUpdateUserAttributes = {
    name: 'Will Smith',
    firstName: 'Will',
    lastName: 'Smith',
    gender: GendersEnum.other,
    mobile: '0971317415',
    aboutMe: 'there is something new',
    dateOfBirth: "1992-08-09",
  }

  static mockedNotFoundUserId = 'a5fde33b-8f37-42ac-ad95-c0918a858070'

  static mockedResource = {
    id: '08dc07b2-dd0b-4fed-851f-aa43ea53c416',
    userId: AuthFixture.mockedUser.id,
    cloudUrl: 'https://dummyurl.com/demo.mp4',
    type: ResourceTypesEnum.video,
  }

  static mockedReact = {
    userId: AuthFixture.mockedAuthToken.userId,
    resourceId: AuthFixture.mockedResource.id,
    type: ReactTypesEnum.like,
  }

  static async cleanUp () {
    await Model.Users.update({ avatarResourceId: null }, { where: {} })
    await Model.React.destroy({ where: {} })
    await Model.Resources.destroy({ where: {} })
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

  static async reactSeeder () {
    await Model.Users.create(AuthFixture.mockedUser)
    await Model.Users.create(AuthFixture.mockedUser1)
    await Model.AuthTokens.create(AuthFixture.mockedAuthToken)
    await Model.Resources.create(AuthFixture.mockedResource)
  }

  static async alreadyReactedSeeder () {
    await Model.Users.create(AuthFixture.mockedUser)
    await Model.Users.create(AuthFixture.mockedUser1)
    await Model.AuthTokens.create(AuthFixture.mockedAuthToken)
    await Model.Resources.create(AuthFixture.mockedResource)
    await Model.React.create(AuthFixture.mockedReact)
  }
}
