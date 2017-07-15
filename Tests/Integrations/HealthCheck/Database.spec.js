'use strict'

import app from '../../../App'
import chai from 'chai'
import chaiHttp from 'chai-http'

const should = chai.should()
const expect = chai.expect

chai.use(chaiHttp)

describe('Integration >> HealthCheck >> Database', () => {
  it('checks if app is connected to database properly', (done) => {
    chai.request(app)
      .get('/health-check/database')
      .end((err, res) => {
        res.should.have.status(200)
        expect(res).to.be.json

        expect(res.body).to.deep.equal({
          statusCode: 200,
          message: 'database connection is stable'
        })

        done()
      })
  })
})
