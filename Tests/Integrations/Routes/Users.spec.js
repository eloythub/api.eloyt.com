'use strict'

import app from '../../../App'
import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiSpies from 'chai-spies'
import proxyquire from 'proxyquire'
import graph from 'fbgraph'
import sinon from 'sinon'
import AuthFixture from '../../Fixtures/Integrations/AuthFixture'
import FacebookFixture from '../../Fixtures/Integrations/FacebookFixture'

const should = chai.should()
const expect = chai.expect

chai.use(chaiSpies)
chai.use(chaiHttp)

describe('Integration >> Routes >> Users >>', () => {
  let sinonStub

  before(async () => {
    sinonStub = sinon.stub(graph, 'get').callsFake((api, fn) => {
      fn(null, FacebookFixture.mockedFacebookProfile)
    })
  })

  beforeEach(async () => {
    await AuthFixture.cleanUp()
  })

  after(async () => {
    sinonStub.restore()

    await AuthFixture.cleanUp()
  })

  it('get registered user data', (done) => {
    (async () => {
      await AuthFixture.authenticationSeeder()

      chai.request(app)
        .put('/users/create-or-get')
        .send({
          accessToken: FacebookFixture.mockedFacebookAccessToken,
          facebookUserId: FacebookFixture.mockedFacebookProfile.id
        })
        .end((err, res) => {
          expect(res).to.be.json

          res.should.have.status(200)

          expect(res.body.statusCode).to.equal(200)
          expect(res.body.data).to.include(AuthFixture.mockedRegisteredUser)
          expect(res.body.action).to.equal('find')

          done()
        })
    })()

  })

  it.skip('register new user and return it\'s data', (done) => {
    chai.request(app)
      .put('/users/create-or-get')
      .send({
        accessToken: FacebookFixture.mockedFacebookAccessToken,
        facebookUserId: FacebookFixture.mockedFacebookProfile.id
      })
      .end((err, res) => {
        expect(res).to.be.json

        res.should.have.status(200)

        expect(res.body.statusCode).to.equal(200)
        expect(res.body.data).to.include(AuthFixture.mockedRegisteredFacebookUser)
        expect(res.body.action).to.equal('create')

        done()
      })
  })

  it.skip('update user profile', (done) => {
    done()
  })

  it.skip('returns the user profile by user id', (done) => {
    done()
  })
})
