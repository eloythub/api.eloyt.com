'use strict';

import debug from 'debug';
import configs from './Configs';

export default class Router {
  constructor() {
    this.routes = [];
  }

  addRoute(route) {
    const log = debug(`${configs.debugZone}:Router:addRoute`);

    log('new route initiated', route.path)

    this.routes.push(route);
  }

  getRoutes() {
    const log = debug(`${configs.debugZone}:Router:addRoute`);

    log('initiated routes retrieved')

    return this.routes;
  }
};
