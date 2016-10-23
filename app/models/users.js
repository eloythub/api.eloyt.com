'use strict';

const BaseModel = require('../base-model');


module.exports = class UsersModel extends BaseModel {
  constructor(env) {
    super(env);

    this.model = this.registerSchema('users', 'users', {
      email: {
        type: String,
        trim: true,
        index: {
          unique: true
        }
      },
      activated: {
        type: Boolean,
        default: true
      },
      registerAt: {
        type: Date,
        default: Date.now
      }
    });

  }

  getUserByEmail(email) {
    const Model = this.model;

    return new Promise((fulfill, reject) => {
      Model.find({
        email: email
      }, (err, res) => {
        if (err) {
          reject(err);

          return;
        }

        fulfill(res[0] || null);
      });
    });
  }

  createUser(email) {
    const Model = this.model;
    const Users = new Model({
      email: email,
    });

    return new Promise((fulfill, reject) => {
      Users.save((err, res) => {
        if (err) {
          reject(err);

          return;
        }

        fulfill(res);
      });
    });
  }
}
