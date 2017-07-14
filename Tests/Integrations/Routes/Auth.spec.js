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

describe('Integration >> Routes >> Auth', () => {
  beforeEach(async () => {
    await AuthFixture.cleanUp()
  })

  it('return generated token id by user id', (done) => {
    AuthFixture.generateTokenSeeder()

    chai.request(app)
      .post('/auth/token/generate')
      .field('userId', AuthFixture.mockedUser.id)
      .end((err, res) => {
        expect(res).to.be.json

        res.should.have.status(200)

        expect(res.body).to.include({
          statusCode: 200,
        })

        expect(res.body.tokenId).to.be.a.uuid('v4')

        done()
      })
  })
})
