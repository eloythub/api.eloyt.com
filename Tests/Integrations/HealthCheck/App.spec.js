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
      .get('/')
      .end((err, res) => {
        res.should.have.status(200)
        expect(res).to.be.json

        expect(res.body).to.deep.equal({
          statusCode: 200,
          message: 'service is up and running'
        })

        done()
      })
  })
})
