'use strict'

import app from '../../../App'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import sinon from 'sinon'
import nock from 'nock'
import AuthFixture from '../../Fixtures/Integrations/AuthFixture'

chai.use(chaiHttp)

describe('Integration >> Routes >> Search >>', () => {
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

  it.skip('search', (done) => {
    (async () => {
      chai.request(app)
        .get('/search')
        .send({
          'query': 'username',
        })
        .end((err, res) => {
          expect(res).to.be.json

          expect(res.status).to.equal(200)

          expect(res.body.statusCode).to.equal(200)

          done()
        })
    })()
  })
})
