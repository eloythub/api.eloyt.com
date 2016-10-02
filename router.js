'use strict';

module.exports = class Router {
  constructor() {
    this.routes = [];
  }

  addRoute(route) {
    this.routes.push(route);
  }

  getRoutes() {
    return this.routes;
  }
}
