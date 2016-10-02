'use strict';

module.exports = class BaseRoute {
  constructor(prefix) {
    const Controllers = require('./' + prefix + '/controllers');

    this.controllers = new Controllers();
    this.prefix = '/' + prefix;
  }
}
