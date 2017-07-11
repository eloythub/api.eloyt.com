'use strict';

export default class Router {
  constructor() {
    this.routes = [];
  }

  addRoute(route) {
    this.routes.push(route);
  }

  getRoutes() {
    return this.routes;
  }
};
