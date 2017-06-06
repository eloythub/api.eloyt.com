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
      lastName: {
        trim: true,
        type: String,
      },
      aboutMe: {
        trim: true,
        type: String,
        default: ''
      },
      gender: {
        trim: true,
        type: String,
      },
      country: {
        trim: true,
        type: String,
      },
      mobile: {
        trim: true,
        type: String,
      },
      hashtags: {
        type: Array,
        default: []
      },
      avatar: {
        type: this.mongoose.Schema.ObjectId,
        ref: 'resources',
      },
      activated: {
        type: Boolean,
        default: false
      },
      birthday: {
        type: Date,
        default: null,
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

  getUserById(userId) {
    const Model = this.model;

    return new Promise((fulfill, reject) => {
      Model.find({
        _id: this.mongoose.Types.ObjectId(userId),
      }, (err, res) => {
        if (err) {
          reject(err);

          return;
        }

        fulfill(res[0] || null);
      });
    });
  }

  create(email, name, firstName, lastName, gender, birthday, avatar) {
    const Model = this.model;

    const Users = new Model({email, name, firstName, lastName, gender, birthday, avatar});

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

  update(userId, attributes) {
    const Model = this.model;
    const Users = new Model();

    // check if avatar is being updated in attributes, then convert to ObjectId
    if (typeof attributes.avatar === 'string') {
      attributes.avatar = this.mongoose.Types.ObjectId(attributes.avatar);
    }

    return new Promise((fulfill, reject) => {
      this.model.findByIdAndUpdate(
        this.mongoose.Types.ObjectId(userId),
        {
          $set: attributes
        },
        (err, res) => {
          if (err) {
            reject(err);

            return;
          }

          this.getUserById(userId).then(fulfill).catch(reject);
        }
      );
    });
  }

  delete(userId) {
    const Model = this.model;
    const Users = new Model();

    return new Promise((fulfill, reject) => {
      Users.find({
          _id: this.mongoose.Types.ObjectId(userId)
        })
        .remove(function (err, res) {
          if (err) {
            reject(err);

            return;
          }

          if (res.result.ok === 0) {
            reject();

            return;
          }

          fulfill();
        })
        .exec();
    });
  }
};
