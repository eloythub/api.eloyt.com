import chai from 'chai';
import sinon from 'sinon';

const expect = chai.expect;

import Router from '../router';

describe('Ruoter', () => {
  it('test', function() {
		const router = new Router({
      'test-env': 'test-env',
    });

		expect(router.addRoute({
      'test-route': 'test-route'
    })).to.equal(null);
	});
});
