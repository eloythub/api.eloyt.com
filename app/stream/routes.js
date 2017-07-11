'use strict';

import StreamController from './controllers';

const Joi = require('joi');

export default class StreamRoutes {
  constructor(router, prefix) {
    this.prefix = `/${prefix}`;
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
          StreamController.videoUploadHandle(req, res);
        },
        validate: {
          payload: {
            file: Joi.any(),
            userId: Joi.string(),
            description: Joi.string(),
            hashtags: Joi.string(),
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
          StreamController.streamResource(req, res);
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

    // thumbnail route
    this.router.addRoute({
      method: 'GET',
      path: this.prefix + '/{userId}/{resourceType}/{resourceId}/thumbnail/{imageSize}',
      config: {
        handler: (req, res) => {
          StreamController.streamThumbnailResource(req, res);
        },
        validate: {
          params: {
            userId: Joi.string(),
            resourceType: Joi.string(),
            resourceId: Joi.string(),
            imageSize: Joi.string(),
          }
        }
      },
    });

    this.router.addRoute({
      method: 'GET',
      path: this.prefix + '/produce/{userId}/{offset}',
      config: {
        handler: (req, res) => {
          StreamController.produceStreamResources(req, res);
        },
        validate: {
          params: {
            userId: Joi.string(),
            offset: Joi.number().integer().min(1).max(100),
          }
        }
      },
    });

    this.router.addRoute({
      method: 'GET',
      path: this.prefix + '/produce/{resourceId}',
      config: {
        handler: (req, res) => {
          StreamController.produceOneStreamResourceById(req, res);
        },
        validate: {
          params: {
            resourceId: Joi.string(),
          }
        }
      },
    });

    this.router.addRoute({
      method: 'POST',
      path: this.prefix + '/{userId}/{resourceId}/{resourceOwnerUserId}/{reactType}',
      config: {
        handler: (req, res) => {
          StreamController.streamResourceReact(req, res);
        },
        validate: {
          params: {
            userId: Joi.string(),
            resourceId: Joi.string(),
            resourceOwnerUserId: Joi.string(),
            reactType: Joi.string(),
          }
        }
      },
    });
  }
};
