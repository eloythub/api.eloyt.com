'use strict';

const BaseRoute = require('../base-router');

module.exports = class UsersRoutes extends BaseRoute {
  constructor(router) {
    super('users');

    this.router = router;

    this.setRoutes();
  }

  setRoutes() {
    this.routeCreate();
    this.routeGet();
  }

  routeCreate() {
    this.router.addRoute({
      method: 'GET',
      path: this.prefix + '/create',
      handler: this.controllers.create,
    });
  }

  routeGet() {
    this.router.addRoute({
      method: 'GET',
      path: this.prefix + '/fetch',
      handler: this.controllers.fetch,
    });
  }
}
