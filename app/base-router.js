'use strict';

module.exports = class BaseRoute {
  constructor(prefix) {
    const Controllers = require('./' + prefix + '/controllers');
    const Repository  = require('./' + prefix + '/repository');

    this.controllers = new Controllers();
    this.repos = new Repository();
    this.prefix = '/' + prefix;
  }
}
