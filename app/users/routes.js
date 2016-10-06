'use strict';

const BaseRoute = require('../base-router');

module.exports = class UsersRoutes extends BaseRoute {
  constructor(router, env, routerBaseUrl) {
    super(router, env, routerBaseUrl);

    this.router = router;

    this.setRoutes();
  }

  setRoutes() {
    this.routeCreate();
  }

  routeCreate() {
    this.router.addRoute({
      method: 'POST',
      path: this.prefix + '/create-or-get',
      handler: this.controllers.createOrGet,
    });
  }
}
