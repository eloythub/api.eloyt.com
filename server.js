'use strict';

import env from './configs';
import Hapi from 'hapi';
import * as Models from './app/models';
import Router from './router';
import Routes from './app/routes';

const debug = require('debug');

export default class Server {
  constructor() {
    this.server = new Hapi.Server();

    // server connection config
    this.server.connection({port: env.exposePort || 80});

    // router setup
    const router = new Router();

    // handle the routes
    new Routes(router);

    this.server.route(router.getRoutes());
  }

  fireUp() {
    const debugLog = debug(`${env.debugZone}:fireUp`);

    this.server.start((err) => {
      if (err) {
        throw err;
      }

      debugLog(`Start running at: ${this.server.info.uri}`);
    });

  }
};
