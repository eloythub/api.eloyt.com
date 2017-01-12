'use strict';

const BaseModel = require('../base-model');

module.exports = class SettingsModel extends BaseModel {
  constructor(env) {
    super(env);

    this.model = this.registerSchema('settings', 'settings', {
      userId: {
        type: this.mongoose.Schema.ObjectId,
        ref: 'users'
      },
      initFrontCameraByDefault: {
        type: Boolean,
        default: true
      },
      highVideoQualityRecord: {
        type: Boolean,
        default: true
      },
      deleteVideoAfterRecord: {
        type: Boolean,
        default: true
      },
    });
  }

  getSettingsByUserId(userId) {
    let base = this;

    const Model = this.model;

    return new Promise((fulfill, reject) => {
      Model.find({
        userId: base.mongoose.Types.ObjectId(userId)
      }, (err, res) => {
        if (err) {
          reject(err);

          return;
        }

        fulfill(res[0] || null);
      });
    });
  }

  saveSettingsByUserId(userId, data) {
    let base = this;

    const Model = this.model;

    return new Promise((fulfill, reject) => {
      Model.update({
        userId: base.mongoose.Types.ObjectId(userId),
      }, data, (err, res) => {
        if (err) {
          reject(err);

          return;
        }

        fulfill();
      });
    });
  }

  createSettings(data) {
    const Model = this.model;
    const Users = new Model(data);

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
};
