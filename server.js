'use strict';

const Hapi   = require('hapi');
const Router = require('./router');
const Routes = require('./app/routes');

module.exports = class Server {
  constructor(port) {
    this.server = new Hapi.Server();

    // server connection config
    this.server.connection({ port: port | 80 });

    // router setup
    const router = new Router();

    // handle the routes
    new Routes(router);

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
