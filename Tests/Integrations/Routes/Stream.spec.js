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
import ReactTypesEnum from '../../../App/Enums/ReactTypesEnum'

chai.use(chaiHttp)

describe('Integration >> Routes >> Stream >>', () => {
  beforeEach(async () => {
    await AuthFixture.cleanUp()
  })

  it.skip('upload video', (done) => {
    done()
  })

  it.skip('returns stream resource data', (done) => {
    done()
  })

  it.skip('returns stream resource thumbnail data', (done) => {
    done()
  })

  it.skip('returns produced stream resources by user id', (done) => {
    done()
  })

  it.skip('returns produced stream resource by resource id', (done) => {
    done()
  })

  it('react to resource', (done) => {
    (async () => {
      await AuthFixture.reactSeeder()

      chai.request(app)
        .post('/stream/react')
        .send({
          resourceId: AuthFixture.mockedResource.id,
          reactType: ReactTypesEnum.like
        })
        .set('authorization', `bearer ${AuthFixture.mockedAuthToken.id}`)
        .end((err, res) => {
          expect(res).to.be.json

          expect(res.status).to.equal(200)

          expect(res.body.statusCode).to.equal(200)
          expect(res.body.data).to.include(AuthFixture.mockedReact)
          expect(res.body.action).to.equal('create')

          done()
        })
    })()
  })

  it('react to resource - already reacted', (done) => {
    (async () => {
      await AuthFixture.alreadyReactedSeeder()

      chai.request(app)
        .post('/stream/react')
        .send({
          resourceId: AuthFixture.mockedResource.id,
          reactType: ReactTypesEnum.like
        })
        .set('authorization', `bearer ${AuthFixture.mockedAuthToken.id}`)
        .end((err, res) => {
          expect(res).to.be.json

          expect(res.status).to.equal(200)

          expect(res.body.statusCode).to.equal(200)
          expect(res.body.data).to.include(AuthFixture.mockedReact)
          expect(res.body.action).to.equal('find')

          done()
        })
    })()
  })
})
