'use strict'

import uuid from 'uuid'
import fs from 'fs'
import debug from 'debug'
import path from 'path'
import configs from '../../Configs'
import StorageService from '../Services/StorageService'
import VideoThumbnailService from '../Services/VideoThumbnailService'
import ResourceRepository from '../Repositories/ResourceRepository'
import ReactRepository from '../Repositories/ReactRepository'
import VideosRepository from '../Repositories/VideosRepository'
import VideosThumbnailsRepository from '../Repositories/VideosThumbnailsRepository'
import ResourceTypesEnum from '../Enums/ResourceTypesEnum'

export default class StreamService {
  static async produceStreamResource (offset, limit) {
    const log = debug(`${configs.debugZone}:StreamService:produceStreamResource`)

    log('produceStreamResource')

    const videoResources = await ResourceRepository.fetchProducedVideoResourcesByLimit(offset, limit)

    return videoResources
  }

  static async produceStreamResourceById (videoResourceId) {
    const log = debug(`${configs.debugZone}:StreamService:produceStreamResourceById`)

    log('produceStreamResourceById')

    const videoResources = await ResourceRepository.fetchProducedVideoResourcesByResourceId(videoResourceId)

    return videoResources
  }

  static async reactToResource (userId, resourceId, type) {
    const log = debug(`${configs.debugZone}:StreamService:reactToResource`)

    log('reactToResource')

    const isAlreadyReacted = await ReactRepository.isAlreadyReacted(userId, resourceId, type)

    if (isAlreadyReacted) {
      const data = await ReactRepository.fetchReactByAttributes({userId, resourceId, type})

      return { data, action: 'find' }
    }

    const data = await ReactRepository.createReact(userId, resourceId, type)

    return { data, action: 'create' }
  }

  static async getVideoThumbnailResource (videoResourceId) {
    const log = debug(`${configs.debugZone}:StreamService:getVideoThumbnailResource`)

    log('getVideoThumbnailResource')

    const isThumbnailAlreadyExists = await VideosThumbnailsRepository.isAlreadyExists(videoResourceId)

    if (isThumbnailAlreadyExists) {
      const videoThumbnail = await VideosThumbnailsRepository.fetchThumbnailByVideoResourceId(videoResourceId)

      const data = await ResourceRepository.fetchResourceById(videoThumbnail.thumbnailResourceId)

      return { data, action: 'find' }
    }

    const videoResource = await ResourceRepository.fetchResourceById(videoResourceId)

    const data = await VideoThumbnailService.createVideoThumbnail(videoResource)

    return { data, action: 'create' }
  }

  static uploadVideoResource (userId, uploadFile, description, hashtags) {
    const log = debug(`${configs.debugZone}:StreamService:uploadVideoResource`)
    const error = debug(`${configs.debugZone}:StreamService:uploadVideoResource:error`)

    const uploadedFileName = uuid.v4() + '.mp4'
    const uploadedFilePath = path.join(__dirname, '/../../tmp/', uploadedFileName)

    const fileStream = fs.createWriteStream(uploadedFilePath)

    return new Promise((resolve, reject) => {
      try {
        fileStream.on('error', (err) => {
          error(err.message)

          return reject(err)
        })

        uploadFile.pipe(fileStream)

        uploadFile.on('end', async (err) => {
          if (err) {
            error(err.message)

            return reject(err)
          }

            // Add video Resource
          const videoResource = await StorageService.uploadToGoogleCloudStorage(
              uploadedFileName,
              uploadedFilePath,
              userId,
              ResourceTypesEnum.video
            )

          try {
            // handle video properties
            await VideosRepository.createProperty(videoResource.id, description)

            // handle video hashtags
            await VideosRepository.createHashtags(videoResource.id, hashtags)

            fs.unlink(uploadedFilePath, () => {
              log(`video has been uploaded successfully: ${videoResource.cloudUrl}`)

              resolve(videoResource)
            })
          } catch (err) {
            error(err.message)

            fs.unlink(uploadedFilePath, async () => {
              await VideosRepository.deleteVideoHashtagsByVideoResourceId(videoResource.id)
              await VideosRepository.deleteVideoPropertyByVideoResourceId(videoResource.id)
              await StorageService.deleteVideoResource(videoResource.id)

              reject(err)
            })
          }
        })
      } catch (err) {
        error(err.message)

        fs.unlink(uploadedFilePath, () => {
          reject(err)
        })
      }
    })
  }
};
