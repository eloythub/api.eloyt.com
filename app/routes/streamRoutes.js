'use strict'

import StreamController from '../controllers/streamController'

const Joi = require('joi')

export default class StreamRoutes {
  static setRoutes (router, prefix) {
    router.addRoute({
      method: 'POST',
      path: `/${prefix}/upload/video`,
      config: {
        payload: {
          timeout: 30034,
          allow: 'multipart/form-data',
          maxBytes: 2097152000, // almost 2GB
          output: 'stream',
          parse: true
        },
        handler: (req, res) => {
          StreamController.videoUploadHandle(req, res)
        },
        validate: {
          payload: {
            file: Joi.any(),
            userId: Joi.string(),
            description: Joi.string(),
            hashtags: Joi.string(),
            geoLocationLatitude: Joi.number(),
            geoLocationLongitude: Joi.number()
          }
        }
      }
    })

    router.addRoute({
      method: 'GET',
      path: `/${prefix}/{userId}/{resourceType}/{resourceId}`,
      config: {
        handler: (req, res) => {
          StreamController.streamResource(req, res)
        },
        validate: {
          params: {
            userId: Joi.string(),
            resourceType: Joi.string(),
            resourceId: Joi.string()
          }
        }
      }
    })

    // thumbnail route
    router.addRoute({
      method: 'GET',
      path: `/${prefix}/{userId}/{resourceType}/{resourceId}/thumbnail/{imageSize}`,
      config: {
        handler: (req, res) => {
          StreamController.streamThumbnailResource(req, res)
        },
        validate: {
          params: {
            userId: Joi.string(),
            resourceType: Joi.string(),
            resourceId: Joi.string(),
            imageSize: Joi.string()
          }
        }
      }
    })

    router.addRoute({
      method: 'GET',
      path: `/${prefix}/produce/{userId}/{offset}`,
      config: {
        handler: (req, res) => {
          StreamController.produceStreamResources(req, res)
        },
        validate: {
          params: {
            userId: Joi.string(),
            offset: Joi.number().integer().min(1).max(100)
          }
        }
      }
    })

    router.addRoute({
      method: 'GET',
      path: `/${prefix}/produce/{resourceId}`,
      config: {
        handler: (req, res) => {
          StreamController.produceOneStreamResourceById(req, res)
        },
        validate: {
          params: {
            resourceId: Joi.string()
          }
        }
      }
    })

    router.addRoute({
      method: 'POST',
      path: `/${prefix}/{userId}/{resourceId}/{resourceOwnerUserId}/{reactType}`,
      config: {
        handler: (req, res) => {
          StreamController.streamResourceReact(req, res)
        },
        validate: {
          params: {
            userId: Joi.string(),
            resourceId: Joi.string(),
            resourceOwnerUserId: Joi.string(),
            reactType: Joi.string()
          }
        }
      }
    })
  }
};
