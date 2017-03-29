'use strict';

const StreamRepository = require('../stream/repository');
const UsersModel       = require('../models/users');
const graph            = require('fbgraph');
const uuid             = require('uuid');

const options = {
  timeout: 3000
  , pool: {maxSockets: Infinity}
  , headers: {connection: "keep-alive"}
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

      // Fetch profile picture from FB and upload to cloud storage
      const email     = profileInfo.email;
      const name      = profileInfo.name;
      const firstName = profileInfo.first_name;
      const lastName  = profileInfo.last_name;
      const gender    = profileInfo.gender;
      const birthday  = profileInfo.birthday;

      this.usersModel.create(email, name, firstName, lastName, gender, birthday)
        .then((user) => {
          // upload to cloud storage
          this.streamRepository.uploadToGCLOUDFromUrl(profilePicture.data.url, 'jpg', user._id, null, 'avatar')
            .then((gCloudResponse) => {
              // update the avatar of the user
              this.usersModel.update(user._id, {avatar: gCloudResponse._id})
                .then(fulfill)
                .catch(reject);
            })
            .catch(reject);
        })
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

  updateUserProfile(userId, attributes) {
    return new Promise((fulfill, reject) => {
      return this.usersModel.update(userId, attributes)
        .then(fulfill)
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
      'friends',
      'picture',
      'about',
      'birthday',
      'likes',
      'location',
    ];

    const api = `${user.userId}?fields=${fields.join(',')}&access_token=${user.tokenId}`;

    return new Promise((fulfill, reject) => {
      graph.setVersion("2.8");

      graph.setOptions(options).get(api, function (error, res) {
        if (error) {
          reject(error);

          return;
        }

        fulfill(res);
      });
    });
  }

  fetchProfilePictureFromFb(user) {
    const api = `${user.userId}/picture?&access_token=${user.tokenId}&width=1024&redirect=false`;

    return new Promise((fulfill, reject) => {
      graph.setVersion("2.8");

      graph.setOptions(options).get(api, function (error, res) {
        if (error) {
          reject(error);

          return;
        }

        fulfill(res);
      });
    });
  }
};
