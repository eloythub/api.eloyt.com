'use strict'

import debug from 'debug'
import configs from '../../Configs'
import * as Models from '../Models'
import HashtagsRepository from '../Repositories/HashtagsRepository'

export default class VideosRepository {
  static async createProperty (videoResourceId, description) {
    const log = debug(`${configs.debugZone}:VideosRepository:createProperty`)

    log('createProperty')

    const videoProperty = await Models.VideosProperties.create({videoResourceId, description})

    if (!videoProperty) {
      throw new Error('failed to create video property')
    }

    return videoProperty.dataValues
  }

  static async createHashtags (videoResourceId, hashtags) {
    const log = debug(`${configs.debugZone}:VideosRepository:createHashtags`)

    log('createHashtags')

    let bulkHashtagRepository = []

    for (const hashtagSlug of hashtags) {
      const hashtagId = await HashtagsRepository.fetchIdBySlug(hashtagSlug)

      bulkHashtagRepository.push({videoResourceId, hashtagId})
    }

    const bulkVideoHashtagsResponse = await Models.VideosHashtags.bulkCreate(bulkHashtagRepository)

    if (!bulkVideoHashtagsResponse) {
      throw new Error('failed to create video hashtags')
    }

    return true
  }

  static async deleteVideoHashtagsByVideoResourceId (videoResourceId) {
    const log = debug(`${configs.debugZone}:VideosRepository:deleteVideoHashtagsByVideoResourceId`)

    log('deleteVideoHashtagsByVideoResourceId')

    const videoHashtag = await Models.VideosHashtags.destroy({where: {videoResourceId}})

    return videoHashtag
  }

  static async deleteVideoPropertyByVideoResourceId (videoResourceId) {
    const log = debug(`${configs.debugZone}:VideosRepository:deleteVideoPropertyByVideoResourceId`)

    log('deleteVideoPropertyByVideoResourceId')

    const videosProperties = await Models.VideosProperties.destroy({where: {videoResourceId}})

    return videosProperties
  }
};
