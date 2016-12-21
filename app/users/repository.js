'use strict';

const StreamRepository = require('../stream/repository');
const UsersModel       = require('../models/users');
const graph            = require('fbgraph');
const http             = require('http');

const options = {
    timeout:  3000
  , pool:     { maxSockets:  Infinity }
  , headers:  { connection:  "keep-alive" }
};

module.exports = class Repository {
  constructor(env) {
    this.env              = env;
    this.usersModel       = new UsersModel(env);
    this.streamRepository = new StreamRepository(env);
  }

  getUserByEmail(profileInfo, profilePicture, findUserByEmailResponse) {
    return new Promise((fulfill, reject) => {
      if (findUserByEmailResponse) {
        fulfill(findUserByEmailResponse);

        return;
      }

      //http.get(profilePicture.data.url, (response) => {
      //
      //});
      //  .then((response) => {
      //    this.streamRepository.uploadToGCLOUD(
      //      userId,
      //      null,
      //      uploadedFileName,
      //      profilePicture.data.url,
      //      fileStream,
      //      'video'
      //    )
      //  })
      //  .catch(reject);

      // Fetch profile picture from FB and upload to cloud storage
      const email = profileInfo.email;
      const name = profileInfo.name;
      const firstName = profileInfo.first_name;
      const lastName = profileInfo.last_name;
      const gender = profileInfo.gender;
      const avatar = null;

      this.usersModel.create(email, name, firstName, lastName, gender)
        .then(fulfill)
        .catch(reject);
    });
  }

  fetchOrCreateUser(tokenId, userId) {
    return new Promise((fulfill, reject) => {
      const user = {tokenId: tokenId, userId: userId};

      let profileInfoPromise    = this.fetchProfileFromFb(user);
      let profilePicturePromise = this.fetchProfilePictureFromFb(user);

      Promise.all([profileInfoPromise, profilePicturePromise])
        .then((result) => {
          let [profileInfo, profilePicture] = result;

          this.usersModel.getUserByEmail(profileInfo.email)
            .then((findUserByEmailResponse) => {
              this.getUserByEmail(profileInfo, profilePicture, findUserByEmailResponse)
                .then(fulfill)
                .catch(reject);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  fetchProfileFromFb(user) {
    const fields = [
      'id',
      'email',
      'name',
      'gender',
      'first_name',
      'last_name',
    ];

    const api = `${user.userId}?fields=${fields.join(',')}&access_token=${user.tokenId}`;

    return new Promise((fulfill, reject) => {
      graph.setVersion("2.8");

      graph.setOptions(options).get(api, function(error, res) {
        if (error) {
          reject(error);

          return;
        }

        fulfill(res);
      });
    });
  }

  fetchProfilePictureFromFb(user) {
    const fields = [
      'id',
      'email',
      'name',
      'gender',
      'first_name',
      'last_name',
      'picture',
    ];

    const api = `${user.userId}/picture?&access_token=${user.tokenId}&width=1024&redirect=false`;

    return new Promise((fulfill, reject) => {
      graph.setVersion("2.8");

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
