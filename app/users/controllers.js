'use strict';

const Repository = require('./repository');

module.exports = class Controllers {
  constructor(env) {
    this.env   = env;
    this.repos = new Repository(env);
  }

  createOrGet(req, res) {
    if (!req.payload.credentials) {
      return res({
        statusCode: 403,
        error: 'credential is not valid',
      }).code(403);
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
        error,
      }).code(500);
    });
  }

  profileUpdate(req, res) {
    if (!req.payload.credentials.userId) {
      return res({
        statusCode: 403,
        error: 'userId is not valid',
      }).code(403);
    }

    this.repos.updateUserProfile(
      req.payload.credentials.userId,
      req.payload.credentials.attributes
    ).then((data) => {
      return res({
        statusCode: 200,
        data: data,
      });
    }, (error) => {
      return res({
        statusCode: 500,
        error,
      }).code(500);
    });
  }

  getProfile(req, res) {
    if (!req.params.userId) {
      return res({
        statusCode: 403,
        error: 'userId is not valid',
      }).code(403);
    }

    this.repos.getUserProfileById(req.params.userId)
      .then((data) => {
        return res({
          statusCode: 200,
          data: data,
        });
      }, (error) => {
        return res({
          statusCode: 500,
          error,
        }).code(500);
      });
  }
};
