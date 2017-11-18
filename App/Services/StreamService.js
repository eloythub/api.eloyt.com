'use strict'

import uuid from 'uuid'
import fs from 'fs'
import debug from 'debug'
import path from 'path'
import configs from '../../Configs'
import StorageService from '../Services/StorageService'
import VideoThumbnailService from '../Services/VideoThumbnailService'
import ChatRecipientsService from '../Services/ChatRecipientsService'
import ResourceRepository from '../Repositories/ResourceRepository'
import ReactRepository from '../Repositories/ReactRepository'
import VideosRepository from '../Repositories/VideosRepository'
import VideosThumbnailsRepository from '../Repositories/VideosThumbnailsRepository'
import ResourceTypesEnum from '../Enums/ResourceTypesEnum'

const log = debug(`${configs.debugZone}:StreamService`)
const error = debug(`${configs.debugZone}:StreamService:error`)

export default class StreamService {
  static async produceStreamResource (offset, limit, lat, lng, radius) {
    log('produceStreamResource')

    const videoResources = await ResourceRepository.fetchProducedVideoResourcesByLimit(offset, limit, lat, lng, radius)

    return videoResources
  }

  static async produceStreamResourceById (videoResourceId) {
    log('produceStreamResourceById')

    const videoResources = await ResourceRepository.fetchProducedVideoResourcesByResourceId(videoResourceId)

    return videoResources
  }

  static async reactToResource (userId, resourceId, type) {
    log('reactToResource')

    // get resource's owner user id
    const resourceOwnerUserId = await ResourceRepository.fetchUserIdFromResourceById(resourceId)

    const isAlreadyReacted = await ReactRepository.isAlreadyReacted(userId, resourceId, type)

    if (isAlreadyReacted) {
      const data = await ReactRepository.fetchReactByAttributes({userId, resourceId, type})

      await ChatRecipientsService.addNewRecipients(userId, resourceOwnerUserId)

      return { data, action: 'find' }
    }

    const data = await ReactRepository.createReact(userId, resourceId, type)

    await ChatRecipientsService.addNewRecipients(userId, resourceOwnerUserId)

    return { data, action: 'create' }
  }

  static async getVideoThumbnailResource (videoResourceId) {
    log('getVideoThumbnailResource')

    const videoResource = await ResourceRepository.fetchResourceById(videoResourceId, ResourceTypesEnum.video)

    if (!videoResource) {
      throw new Error('not-found')
    }

    const isThumbnailAlreadyExists = await VideosThumbnailsRepository.fetchThumbnailByVideoResourceId(videoResourceId)

    if (isThumbnailAlreadyExists) {
      const videoThumbnail = await VideosThumbnailsRepository.fetchThumbnailByVideoResourceId(videoResourceId)

      const data = await ResourceRepository.fetchResourceById(videoThumbnail.thumbnailResourceId, ResourceTypesEnum.thumbnail)

      return { data, action: 'find' }
    }

    const data = await VideoThumbnailService.createVideoThumbnail(videoResource)

    return { data, action: 'create' }
  }

  static uploadVideoResource (userId, uploadFile, description, hashtags) {
    log('uploadVideoResource')

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
          const videoResource = await StorageService.uploadTo(
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

            fs.unlink(uploadedFilePath, async () => {
              log(`video has been uploaded successfully: ${videoResource.cloudUrl}`)

              const producedVideo = await StreamService.produceStreamResourceById(videoResource.id)

              resolve(producedVideo)
            })
          } catch (err) {
            error(err.message)

            fs.unlink(uploadedFilePath, async () => {
              await VideosRepository.deleteVideoHashtagsByVideoResourceId(videoResource.id)
              await VideosRepository.deleteVideoPropertyByVideoResourceId(videoResource.id)
              await StorageService.deleteVideoResourceFromGCloud(videoResource.id)

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
