'use strict';

const BaseRoute = require('../base-router');

module.exports = class UsersRoutes extends BaseRoute {
  constructor(router, env, routerBaseUrl) {
    super(router, env, routerBaseUrl);

    this.router = router;

    this.setRoutes();
  }

  setRoutes() {
    this.router.addRoute({
      method: 'PUT',
      path: this.prefix + '/create-or-get',
      handler: (req, res) => this.controllers.createOrGet(req, res),
    });

    this.router.addRoute({
      method: 'POST',
      path: this.prefix + '/profile-update',
      handler: (req, res) => this.controllers.profileUpdate(req, res),
    });
  }
};
