'use strict';

module.exports = class BaseRoute {
  constructor(router, env, prefix) {
    const Controllers = require('./' + prefix + '/controllers');

    this.env         = env;
    this.controllers = new Controllers(env);
    this.prefix      = '/' + prefix;
  }
}
