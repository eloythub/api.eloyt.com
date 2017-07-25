'use strict'

import debug from 'debug'
import configs from '../../Configs'
import * as Models from '../Models'

export default class VideosThumbnailsRepository {
  static async isAlreadyExists (videoResourceId) {
    const log = debug(`${configs.debugZone}:VideosThumbnailsRepository:isAlreadyExists`)

    log('isAlreadyExists')

    const videoThumbnailCount = await Models.VideosThumbnails.count({where: {videoResourceId}})

    return videoThumbnailCount !== 0
  }

  static async fetchThumbnailByVideoResourceId (videoResourceId) {
    const log = debug(`${configs.debugZone}:VideosThumbnailsRepository:fetchThumbnailByVideoResourceId`)

    log('fetchThumbnailByVideoResourceId')

    const videoThumbnail = await Models.VideosThumbnails.findOne({where: {videoResourceId}})

    if (!videoThumbnail) {
      return null
    }

    return videoThumbnail.dataValues
  }

  static async createThumbnail (videoResourceId, thumbnailResourceId, imageSize = null) {
    const log = debug(`${configs.debugZone}:VideosRepository:createThumbnail`)

    log('createThumbnail')

    const videoThumbnail = await Models.VideosThumbnails.create({videoResourceId, thumbnailResourceId, imageSize})

    if (!videoThumbnail) {
      throw new Error('failed to create video thumbnail')
    }

    return videoThumbnail.dataValues
  }
};
