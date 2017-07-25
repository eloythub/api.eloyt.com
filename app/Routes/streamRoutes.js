'use strict'

import * as Joi from 'joi'
import StreamController from '../Controllers/StreamController'

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
            file: Joi.any().required(),
            description: Joi.string().required(),
            hashtags: Joi.string().required()
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
      path: `/stream/thumbnail/{videoResourceId}/{imageSize}`,
      config: {
        auth: 'token',
        handler: (req, res) => {
          StreamController.streamThumbnailResource(req, res)
        },
        validate: {
          params: {
            videoResourceId: Joi.string().required(),
            imageSize: Joi.string().required()
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
      path: `/stream/react`,
      config: {
        auth: 'token',
        handler: (req, res) => {
          StreamController.streamResourceReact(req, res)
        },
        validate: {
          payload: {
            resourceId: Joi.string().required(),
            reactType: Joi.string().allow(['like', 'dislike', 'skip']).required()
          }
        }
      }
    })
  }
};
