'use strict'

import StreamController from '../Controllers/StreamController'
import * as Joi from 'joi'

export default class StreamRoutes {
  static setRoutes (router) {
    router.addRoute({
      method: 'POST',
      path: `/stream/upload/video`,
      config: {
        auth: 'token',
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
            geoLocation: Joi.object()
              .keys({
                latitude: Joi.number().required(),
                longitude: Joi.number().required()
              })
              .required()
          }
        }
      }
    })

    router.addRoute({
      method: 'GET',
      path: `/stream/{userId}/{resourceType}/{resourceId}`,
      config: {
        auth: 'token',
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
      path: `/stream/{userId}/{resourceType}/{resourceId}/thumbnail/{imageSize}`,
      config: {
        auth: 'token',
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
      path: `/stream/produce/{userId}/{offset}`,
      config: {
        auth: 'token',
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
      path: `/stream/produce/{resourceId}`,
      config: {
        auth: 'token',
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
      path: `/stream/{userId}/{resourceId}/{resourceOwnerUserId}/{reactType}`,
      config: {
        auth: 'token',
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
