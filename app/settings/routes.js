'use strict';

const BaseRoute = require('../base-router');

module.exports = class SettingsRoutes extends BaseRoute {
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
      method: 'GET',
      path: this.prefix + '/{userId}',
      handler: (req, res) => {
        this.controllers.getSettings(req, res);
      },
    });
    this.router.addRoute({
      method: 'PATCH',
      path: this.prefix + '/{userId}',
      handler: (req, res) => {
        this.controllers.saveSettings(req, res);
      },
    });
  }
};
