'use strict'

import app from '../../../App'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import AuthFixture from '../../Fixtures/Integrations/AuthFixture'

chai.use(chaiHttp)

describe('Integration >> Routes >> Hashtags >>', () => {
  beforeEach(async () => {
    await AuthFixture.cleanUp()
  })

  it.skip('get all hashtags', (done) => {
    (async () => {
      await AuthFixture.authenticationSeeder()
      // TODO: add hashtags seeds

      chai.request(app)
        .get('/hashtags')
        .set('authorization', `bearer ${AuthFixture.mockedAuthToken.id}`)
        .send()
        .end((err, res) => {
          expect(res).to.be.json

          expect(res.status).to.equal(200)

          expect(res.body.statusCode).to.equal(200)
          //expect(res.body.data).to.include(AuthFixture.mockedRegisteredUser) // get hashtag mocked data

          done()
        })
    })()
  })
})
