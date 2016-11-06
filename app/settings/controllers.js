'use strict';

const Repository = require('./repository');

module.exports = class Controllers {
  constructor(env) {
    this.env   = env;
    this.repos = new Repository(env);
  }

  getSettings(req, res) {
    if (!req.params.userId) {
      res({
        statusCode: 403,
        error: 'credential is not valid',
      });

      return;
    }

    this.repos.getSettingsByUserId(
      req.params.userId
    ).then((data) => {
      if (!data) {
        const defaultSettings = {
          userId: req.params.userId,
          initFrontCameraByDefault: false,
          highVideoQualityRecord: false,
          deleteVideoAfterRecord: false,
        };

        this.repos.createSettings(
          defaultSettings
        ).then(() => {
          res({
            statusCode: 200,
            data: defaultSettings,
          });
        }, (error) => {
          res({
            statusCode: 500,
            error: 'something went wrong, check the logs of ::getSettingsByUserId',
          });
        });

        return;
      }

      res({
        statusCode: 200,
        data: data,
      });
    }, (error) => {
      res({
        statusCode: 500,
        error: 'something went wrong, check the logs of ::getSettingsByUserId',
      });
    });
  }

  saveSettings(req, res) {
    if (!req.params.userId) {
      res({
        statusCode: 403,
        error: 'credential is not valid',
      });

      return;
    }

    this.repos.saveSettingsByUserId(
      req.params.userId,
      req.payload
    ).then((data) => {
      res({
        statusCode: 200,
        data: data,
      });
    }, (error) => {
      res({
        statusCode: 500,
        error: 'something went wrong, check the logs of ::getSettingsByUserId',
      });
    });
  }
}
