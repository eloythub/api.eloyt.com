'use strict';

module.exports = class Router {
  constructor(env) {
    this.routes = [];
    this.env    = env;
  }

  addRoute(route) {
    this.routes.push(route);
  }

  getRoutes() {
    return this.routes;
  }
};
