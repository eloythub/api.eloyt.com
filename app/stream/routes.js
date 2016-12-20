'use strict';

const BaseRoute = require('../base-router');
const Joi = require('joi')

module.exports = class StreamRoutes extends BaseRoute {
  constructor(router, env, routerBaseUrl) {
    super(router, env, routerBaseUrl);

    this.router = router;

    this.setRoutes();
  }

  setRoutes() {
    this.router.addRoute({
      method: 'POST',
      path: this.prefix + '/upload/video',
      config: {
        payload: {
          timeout: 30034,
          allow: 'multipart/form-data',
          maxBytes: 2097152000, // almost 2GB
          output: 'stream',
          parse: true,
        },
        handler: (req, res) => {
          this.controllers.videoUploadHandle(req, res);
        },
        validate: {
          payload: {
            file: Joi.any(),
            userId: Joi.string(),
            geoLocationLatitude: Joi.number(),
            geoLocationLongitude: Joi.number(),
          }
        }
      },
    });
  }
}
