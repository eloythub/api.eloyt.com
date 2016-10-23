'use strict';

const UsersModel = require('../models/users');
const graph      = require('fbgraph');
const http       = require('http');
const options    = {
    timeout:  3000
  , pool:     { maxSockets:  Infinity }
  , headers:  { connection:  "keep-alive" }
};

module.exports = class Repository {
  constructor(env) {
    this.env        = env;
    this.usersModel = new UsersModel(env);
  }

  getUserByEmail(email, findUserByEmailResponse) {
    let base = this;

    return new Promise((fulfill, reject) => {
      if (findUserByEmailResponse) {
        fulfill(findUserByEmailResponse);

        return;
      }

      base.usersModel.createUser(email).then(fulfill, reject);
    });
  }

  fetchOrCreateUser(tokenId, userId) {
    let base = this;
    graph.setAccessToken(tokenId);

    return new Promise((fulfill, reject) => {
      base.fetchProfileFromFb({
        tokenId: tokenId,
        userId: userId,
      }).then((data) => {
        base.usersModel.getUserByEmail(data.email)
          .then((findUserByEmailResponse) => {
            base.getUserByEmail(
              data.email,
              findUserByEmailResponse
            ).then(fulfill, reject);
          }, reject)
      }, (error) => {
        reject(error);
      });
    });
  }

  fetchProfileFromFb(user) {
    const api = `${user.userId}?fields=id,email,name&access_token=${user.tokenId}`;

    return new Promise((fulfill, reject) => {
      graph.setOptions(options).get(api, function(error, res) {
        if (error) {
          reject(error);

          return;
        }

        fulfill(res);
      });
    });
  }
}
