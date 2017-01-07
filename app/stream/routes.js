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

    this.router.addRoute({
      method: 'GET',
      path: this.prefix + '/{userId}/{resourceType}/{resourceId}',
      config: {
        handler: (req, res) => {
          this.controllers.streamResource(req, res);
        },
        validate: {
          params: {
            userId: Joi.string(),
            resourceType: Joi.string(),
            resourceId: Joi.string(),
          }
        }
      },
    });

    this.router.addRoute({
      method: 'GET',
      path: this.prefix + '/produce/{userId}/{offset}',
      config: {
        handler: (req, res) => {
          this.controllers.produceStreamResources(req, res);
        },
        validate: {
          params: {
            userId: Joi.string(),
            offset: Joi.number().integer().min(1).max(100),
          }
        }
      },
    });
  }
}
