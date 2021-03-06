'use strict'

import app from '../../../App'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import graph from 'fbgraph'
import sinon from 'sinon'
import nock from 'nock'
import path from 'path'
import AuthFixture from '../../Fixtures/Integrations/AuthFixture'
import FacebookFixture from '../../Fixtures/Integrations/FacebookFixture'

chai.use(chaiHttp)

describe('Integration >> Routes >> Users >>', () => {
  let sandbox

  before(async () => {
    sandbox = sinon.sandbox.create()
  })

  beforeEach(async () => {
    await AuthFixture.cleanUp()
  })

  afterEach(async () => {
    sandbox.restore()
    nock.restore()
  })

  it('get registered user data', (done) => {
    (async () => {
      await AuthFixture.authenticationSeeder()

      sandbox.stub(graph, 'get').callsFake((api, fn) => {
        fn(null, FacebookFixture.mockedFacebookProfile)
      })

      chai.request(app)
        .put('/users/create-or-get')
        .send({
          accessToken: FacebookFixture.mockedFacebookAccessToken,
          facebookUserId: FacebookFixture.mockedFacebookProfile.id
        })
        .end((err, res) => {
          expect(res).to.be.json

          expect(res.status).to.equal(200)

          expect(res.body.statusCode).to.equal(200)
          expect(res.body.data).to.include(AuthFixture.mockedRegisteredUser)
          expect(res.body.action).to.equal('find')

          done()
        })
    })()
  })

  it.skip('register new user and return data', (done) => {
    (async () => {
      let position = 1

      sandbox.stub(graph, 'get')
        .callsFake((api, fn) => {
          fn(
            null,
            position++ === 1
              ? FacebookFixture.mockedFacebookProfile // first call
              : FacebookFixture.mockedFacebookPicture // second call
          )
        })

      // TODO: fix the issue with the nock
      nock(FacebookFixture.mockedFacebookPictureBaseUrl)
        .get(FacebookFixture.mockedFacebookPictureUrlRoute)
        .replyWithFile(200, path.resolve(path.join(__dirname, '../../Fixtures/Assets/FacebookPicture.jpg')))

      // TODO: mock the google Storage upload

      chai.request(app)
        .put('/users/create-or-get')
        .send({
          accessToken: FacebookFixture.mockedFacebookAccessToken,
          facebookUserId: FacebookFixture.mockedFacebookProfile.id
        })
        .end((err, res) => {
          expect(res).to.be.json

          expect(res.status).to.equal(200)

          expect(res.body.statusCode).to.equal(200)
          //expect(res.body.data).to.include(AuthFixture.mockedRegisteredFacebookUser)
          expect(res.body.action).to.equal('create')

          done()
        })
    })()
  })

  it('update user profile - no attributes', (done) => {
    (async () => {
      await AuthFixture.authenticationSeeder()

      chai.request(app)
        .post('/users/profile-update')
        .send({})
        .set('authorization', `bearer ${AuthFixture.mockedAuthToken.id}`)
        .end((err, res) => {
          expect(res).to.be.json

          expect(res.status).to.equal(400)

          expect(res.body.statusCode).to.equal(400)
          expect(res.body.error).to.equal('Bad Request')
          expect(res.body.message).to.equal('child "attributes" fails because ["attributes" is required]')

          done()
        })
    })()
  })

  it('update user profile - empty attributes', (done) => {
    (async () => {
      await AuthFixture.authenticationSeeder()

      chai.request(app)
        .post('/users/profile-update')
        .send({
          attributes: {}
        })
        .set('authorization', `bearer ${AuthFixture.mockedAuthToken.id}`)
        .end((err, res) => {
          expect(res).to.be.json

          expect(res.status).to.equal(400)

          expect(res.body.statusCode).to.equal(400)
          expect(res.body.error).to.equal('Bad Request')
          expect(res.body.message).to.equal('child "attributes" fails because ["attributes" must have at least 1 children]')

          done()
        })
    })()
  })

  it('update user profile - prevent user to update special properties', (done) => {
    (async () => {
      await AuthFixture.authenticationSeeder()

      chai.request(app)
        .post('/users/profile-update')
        .send({
          attributes: {
            email: 'test@test.com'
          }
        })
        .set('authorization', `bearer ${AuthFixture.mockedAuthToken.id}`)
        .end((err, res) => {
          expect(res).to.be.json

          expect(res.status).to.equal(400)

          expect(res.body.statusCode).to.equal(400)
          expect(res.body.error).to.equal('Bad Request')
          expect(res.body.message).to.equal('child "attributes" fails because ["email" is not allowed]')

          done()
        })
    })()
  })

  it('update user profile', (done) => {
    (async () => {
      await AuthFixture.authenticationSeeder()

      chai.request(app)
        .post('/users/profile-update')
        .send({
          attributes: AuthFixture.mockedUpdateUserAttributes
        })
        .set('authorization', `bearer ${AuthFixture.mockedAuthToken.id}`)
        .end((err, res) => {
          expect(res).to.be.json

          expect(res.status).to.equal(200)

          expect(res.body.statusCode).to.equal(200)

          done()
        })
    })()
  })

  it('returns the user profile by user id', (done) => {
    (async () => {
      await AuthFixture.authenticationSeeder()

      chai.request(app)
        .get(`/users/${AuthFixture.mockedAuthToken.userId}`)
        .set('authorization', `bearer ${AuthFixture.mockedAuthToken.id}`)
        .end((err, res) => {
          expect(res).to.be.json

          expect(res.status).to.equal(200)

          expect(res.body.statusCode).to.equal(200)
          expect(res.body.data).to.include(AuthFixture.mockedRegisteredUser)

          done()
        })
    })()
  })

  it('user not found', (done) => {
    (async () => {
      await AuthFixture.authenticationSeeder()

      chai.request(app)
        .get(`/users/${AuthFixture.mockedNotFoundUserId}`)
        .set('authorization', `bearer ${AuthFixture.mockedAuthToken.id}`)
        .end((err, res) => {
          expect(res).to.be.json

          expect(res.status).to.equal(404)

          expect(res.body.statusCode).to.equal(404)
          expect(res.body.message).to.equal('there is no user with requested id')

          done()
        })
    })()
  })

  it.skip('activate user', (done) => {
    (async () => {
      await AuthFixture.authenticationSeeder()

      chai.request(app)
        .post('/users/activate')
        .send()
        .set('authorization', `bearer ${AuthFixture.mockedAuthToken.id}`)
        .end((err, res) => {
          expect(res).to.be.json

          expect(res.status).to.equal(200)

          expect(res.body.statusCode).to.equal(200)

          done()
        })
    })()
  })

})
