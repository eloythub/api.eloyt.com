'use strict';

const Repository = require('./repository');

module.exports = class Controllers {
  constructor(env) {
    this.env   = env;
    this.repos = new Repository(env);
  }

  createOrGet(req, res) {
    if (req.payload.provider !== 'facebook') {
      res({
        statusCode: 403,
        error: 'unknown provider',
      });

      return;
    }

    if (!req.payload.credentials) {
      res({
        statusCode: 403,
        error: 'credential is not valid',
      });

      return;
    }

    this.repos.fetchOrCreateUser(
      req.payload.credentials.token,
      req.payload.credentials.userId
    ).then((data) => {
      res({
        statusCode: 200,
        data: data,
      });
    }, (error) => {
      res({
        statusCode: 500,
        error: 'something went wrong, check the logs of ::fetchOrCreateUser',
      });
    });
  }
}
