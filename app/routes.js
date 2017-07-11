'use strict';

import UsersRoutes from './users/routes';
import StreamRoutes from './stream/routes';
import * as Models from '../app/models';

export default class Routes {
  constructor(router) {
    this.router = router;

    this.setRootRoutes();
    this.setRoutes();
  }

  setRootRoutes() {
    this.router.addRoute({
      method: 'GET',
      path: '/',
      handler: function (request, reply) {
        reply({
          status: true,
          message: 'service is up and running'
        });
      }
    });
  }

  setRoutes() {
    new UsersRoutes(this.router, 'users');
    new StreamRoutes(this.router, 'stream');
  }
};
