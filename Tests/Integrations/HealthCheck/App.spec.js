'use strict'

import app from '../../../App'
import chai from 'chai'
import chaiHttp from 'chai-http'

const should = chai.should()
const expect = chai.expect

chai.use(chaiHttp)

describe('Integration >> HealthCheck >> App', () => {
  it('checks if app is running properly', (done) => {
    chai.request(app)
      .get('/health-check/app')
      .end((err, res) => {
        expect(res.status).to.equal(200)
        expect(res).to.be.json

        expect(res.body).to.deep.equal({
          statusCode: 200,
          message: 'app is up and running'
        })

        done()
      })
  })
})
