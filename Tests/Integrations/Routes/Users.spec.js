'use strict'

import app from '../../../App'
import chai from 'chai'
import chaiHttp from 'chai-http'
import AuthFixture from '../../Fixtures/Integrations/AuthFixture'

const should = chai.should()
const expect = chai.expect

chai.use(chaiHttp)

describe('Integration >> Routes >> Users', () => {
  beforeEach(async () => {
    await AuthFixture.cleanUp()
  })

  it.skip('create new users if user is not existed and return registered data', (done) => {
    chai.request(app)
      .put('/users/create-or-get')
      .end((err, res) => {
        expect(res).to.be.json

        res.should.have.status(200)

        expect(res.body).to.include({
          statusCode: 200,
        })

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
