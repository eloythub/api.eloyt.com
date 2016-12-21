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
      name: {
        trim: true,
        type: String,
      },
      firstName: {
        trim: true,
        type: String,
      },
      lastname: {
        trim: true,
        type: String,
      },
      gender: {
        trim: true,
        type: String,
      },
      avatar: {
        type: this.mongoose.Schema.ObjectId,
        ref: 'resources'
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
        email
      }, (err, res) => {
        if (err) {
          reject(err);

          return;
        }

        fulfill(res[0] || null);
      });
    });
  }

  create(email, name, firstName, lastName, gender, avatar) {
    const Model = this.model;
    const Users = new Model({email, name, firstName, lastName, gender, avatar});

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
