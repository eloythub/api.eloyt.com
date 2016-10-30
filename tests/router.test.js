import chai from 'chai';

const expect = chai.expect;

import Router from '../router';

describe('Router', () => {
  it('addRoute', function() {
		const router = new Router({
      'test-env': 'test-env',
    });

		expect(router.addRoute({
      'test-route': 'test-route'
    })).to.be.empty;
    expect(router.routes).to.deep.equal([ { 'test-route': 'test-route' } ]);
	});

  it('getRoutes', function() {
		const router = new Router({
      'test-env': 'test-env',
    });

    expect(router.getRoutes()).to.deep.equal([]);

    router.addRoute({
      'test-route': 'test-route'
    });

    expect(router.getRoutes()).to.deep.equal([ {'test-route': 'test-route'} ]);
	});
});
