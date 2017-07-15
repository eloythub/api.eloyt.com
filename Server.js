'use strict';

import configs from './Configs';
import Hapi from 'hapi';
import * as Models from './App/Models'; // please don't remove this line, it initiate the db connection
import Router from './Router';
import Routes from './App/Routes';
import Schemas from './App/Schemas';
import debug from 'debug';

export default class Server {
  constructor() {
    this.server = new Hapi.Server();

    // server connection config
    this.server.connection({port: configs.exposePort || 80});

    Schemas.authentication(this.server);

    // router setup
    const router = new Router();

    // handle the routes
    new Routes(router);

    this.server.route(router.getRoutes());
  }

  fireUp() {
    const log = debug(`${configs.debugZone}:fireUp`);

    if (configs.nodeEnv === 'test') {
      log(`Start running at: ${this.server.info.uri}`);

      return this.server.listener;
    }

    this.server.start((err) => {
      if (err) {
        throw err;
      }

      log(`Start running at: ${this.server.info.uri}`);
    });
  }
};
