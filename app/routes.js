'use strict';

const UsersRoutes = require('./users/routes');
const SettingsRoutes = require('./settings/routes');
const StreamRoutes = require('./stream/routes');

module.exports = class Routes {
  constructor(router, env) {
    this.router = router;
    this.env    = env;

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
    new UsersRoutes(this.router, this.env, 'users');
    new SettingsRoutes(this.router, this.env, 'settings');
    new StreamRoutes(this.router, this.env, 'stream');
  }
}
