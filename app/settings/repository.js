'use strict';

const SettingsModel = require('../models/settings');

module.exports = class Repository {
  constructor(env) {
    this.env           = env;
    this.settingsModel = new SettingsModel(env);
  }

  getSettingsByUserId(userId) {
    let base = this;

    return new Promise((fulfill, reject) => {
      base.settingsModel.getSettingsByUserId(userId).then(fulfill, reject);
    });
  }

  saveSettingsByUserId(userId, payload) {
    let base = this;

    return new Promise((fulfill, reject) => {
      if (payload.userId) {
        delete payload['userId'];
      }

      base.settingsModel.saveSettingsByUserId(userId, payload).then(fulfill, reject);
    });
  }

  createSettings(payload) {
    let base = this;

    return new Promise((fulfill, reject) => {
      const data = {
        userId: payload.userId,
        initFrontCameraByDefault: payload.initFrontCameraByDefault,
        highVideoQualityRecord: payload.highVideoQualityRecord,
        deleteVideoAfterRecord: payload.deleteVideoAfterRecord,
      };

      base.settingsModel.createSettings(data).then(fulfill, reject);
    });
  }
};
