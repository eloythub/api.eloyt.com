'use strict'

import app from '../../../App'
import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiUuid from 'chai-uuid'
import AuthFixture from '../../Fixtures/Integrations/AuthFixture'

const should = chai.should()
const expect = chai.expect

chai.use(chaiHttp)
chai.use(chaiUuid)

describe('Integration >> Routes >> Auth >>', () => {
  beforeEach(async () => {
    await AuthFixture.cleanUp()
  })

  it('return generated token id by user id', (done) => {
    (async () => {
      await AuthFixture.generateTokenSeeder()

      chai.request(app)
        .post('/auth/token/generate')
        .field('userId', AuthFixture.mockedUser.id)
        .end((err, res) => {
          expect(res).to.be.json

          expect(res.status).to.equal(200)

          expect(res.body).to.include({
            statusCode: 200,
          })

          expect(res.body.tokenId).to.be.a.uuid('v4')

          done()
        })
    })()
  })

  it('check token validation - no authentication header', (done) => {
    chai.request(app)
      .get('/auth/token/validate')
      .end((err, res) => {
        expect(res).to.be.json

        expect(res.status).to.equal(401)

        expect(res.body).to.deep.equal({
          statusCode: 401,
          message: 'authorization failed'
        })

        done()
      })
  })

  it('check token validation - empty authentication header', (done) => {
    chai.request(app)
      .get('/auth/token/validate')
      .set('Authorization', '')
      .end((err, res) => {
        expect(res).to.be.json

        expect(res.status).to.equal(401)

        expect(res.body).to.deep.equal({
          statusCode: 401,
          message: 'token is not valid'
        })

        done()
      })
  })

  it('check token validation - not correct authentication type', (done) => {
    chai.request(app)
      .get('/auth/token/validate')
      .set('Authorization', 'wrong-type edc08f41-8a6a-40fc-a0c2-fc1283677eef')
      .end((err, res) => {
        expect(res).to.be.json

        expect(res.status).to.equal(401)

        expect(res.body).to.include({
          statusCode: 401,
          message: 'authentication type must be "basic" or "bearer"'
        })

        done()
      })
  })

  it('check token validation - empty token id', (done) => {
    chai.request(app)
      .get('/auth/token/validate')
      .set('Authorization', 'bearer ')
      .end((err, res) => {
        expect(res).to.be.json

        expect(res.status).to.equal(401)

        expect(res.body).to.include({
          statusCode: 401,
          message: 'token id is not valid'
        })

        done()
      })
  })

  it('check token validation - correct token', (done) => {
    (async () => {
      await AuthFixture.authenticationSeeder()

      chai.request(app)
        .get('/auth/token/validate')
        .set('authorization', `bearer ${AuthFixture.mockedAuthToken.id}`)
        .end((err, res) => {
          expect(res).to.be.json

          expect(res.status).to.equal(200)

          expect(res.body).to.deep.equal({
            statusCode: 200,
            data: {
              userId: AuthFixture.mockedUser.id,
            },
          })

          done()
        })
    })()
  })
})
