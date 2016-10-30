import chai from 'chai';
import proxyquire from 'proxyquire';

const expect = chai.expect;
const assert = chai.assert;

let server;

const inputEnv = {
  'exposePort': 800,
};
const inputRoutes = [
  { name: 'test' },
];

let HapiMockOk = {
  Server: () => {
    return {
      info: {
        uri: 'local-test',
      },
      connection: (env) => {
        expect(env).to.eql({ port: 800 });
      },
      route: (routes) => {
        expect(routes).to.eql(inputRoutes);
      },
      start: (callback) => {
        callback();
      },
    };
  },
};

let HapiMockFailed = {
  Server: () => {
    return {
      connection: (env) => {
        expect(env).to.eql({ port: 800 });
      },
      route: (routes) => {
        expect(routes).to.eql(inputRoutes);
      },
      start: (callback) => {
        callback(new Error('test-exception'));
      },
    };
  },
};

let RouterMock = (env) => {
  expect(env).to.eql(inputEnv);
  return {
    getRoutes: () => {
      return inputRoutes;
    },
  };
};

let RoutesMock = () => {};

describe('Server', () => {
  it('fireUp - OK', function() {
    let debugMock = (msg) => {
      expect(msg).to.be.equal('Server running at: local-test');
    };

    let Server = proxyquire('../server', {
      'hapi': HapiMockOk,
      './router': RouterMock,
      './app/routes': RoutesMock,
      'debug': debugMock,
    })

    server = new Server(inputEnv);

    server.fireUp();
	});

  it('fireUp - FAIL', function() {
    let Server = proxyquire('../server', {
      'hapi': HapiMockFailed,
      './router': RouterMock,
      './app/routes': RoutesMock,
    })

    server = new Server(inputEnv);

    expect(() => {
      server.fireUp();
    }).to.throw('test-exception');
	});
});
