'use strict';

const UsersRoutes = require('./users/routes');

module.exports = class Routes {
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
  }
}
