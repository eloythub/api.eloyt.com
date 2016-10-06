'use strict';

const Hapi   = require('hapi');
const Router = require('./router');
const Routes = require('./app/routes');

module.exports = class Server {
  constructor(env) {
    this.server = new Hapi.Server();

    // server connection config
    this.server.connection({ port: env.exposePort | 80 });

    // router setup
    const router = new Router(env);

    // handle the routes
    new Routes(router, env);

    this.server.route(router.getRoutes());
  }

  fireUp () {
    this.server.start((err) => {
      if (err) {
          throw err;
      }

      console.log(`Server running at: ${this.server.info.uri}`);
    });
  }
}
