'use strict'

import fs from 'fs'
import path from 'path'
import uuid from 'uuid'
import https from 'https'
import debug from 'debug'
import Promise from 'promise'
import ffmpeg from 'fluent-ffmpeg'
import configs from '../../Configs'
import StorageService from './StorageService'
import VideosThumbnailsRepository from '../Repositories/VideosThumbnailsRepository'
import ResourceTypesEnum from '../Enums/ResourceTypesEnum'

export default class VideoThumbnailService {
  static async createVideoThumbnail (videoResource) {
    const log = debug(`${configs.debugZone}:VideoThumbnailService:createVideoThumbnail`)
    const error = debug(`${configs.debugZone}:VideoThumbnailService:createVideoThumbnail:error`)

    log('createVideoThumbnail')

    const tmpDownloadFileName = `${uuid.v4()}.mp4`
    const tmpDownloadPath = path.resolve(path.join(__dirname, '/../../tmp/', tmpDownloadFileName))

    const fileStream = fs.createWriteStream(tmpDownloadPath)

    return new Promise((resolve, reject) => {
      https
        .get(videoResource.cloudUrl, (res) => {
          res.pipe(fileStream)

          fileStream.on('finish', async () => {
            const videoThumbnailResource = await VideoThumbnailService.generateThumbnail(videoResource, tmpDownloadPath)

            resolve(videoThumbnailResource)
          })
        })
        .on('error', (err) => {
          fs.unlink(tmpDownloadPath, () => {
            error(err.message)

            reject(err)
          })
        })
    })
  }

  static async generateThumbnail (videoResource, tmpDownloadPath) {
    const log = debug(`${configs.debugZone}:VideoThumbnailService:generateThumbnail`)
    const error = debug(`${configs.debugZone}:VideoThumbnailService:generateThumbnail:error`)

    log('generateThumbnail')

    const tmpDir = path.resolve(path.join(__dirname, '/../../tmp'))

    const tmpThumbnailFileName = `${uuid.v4()}.png`
    const tmpThumbnailPath = path.resolve(path.join(__dirname, '/../../tmp/', tmpThumbnailFileName))

    return new Promise((resolve, reject) => {
      try {
        ffmpeg(tmpDownloadPath)
          .on('error', (err) => {
            error(err.message)

            fs.unlink(tmpDownloadPath, () => {
              reject(err)
            })
          })
          .on('end', async () => {
            const videoThumbnailResource = await StorageService.uploadToGoogleCloudStorage(
              tmpThumbnailFileName,
              tmpThumbnailPath,
              videoResource.userId,
              ResourceTypesEnum.thumbnail
            )

            await VideosThumbnailsRepository.createThumbnail(
              videoResource.id,
              videoThumbnailResource.id
            )

            fs.unlink(tmpThumbnailPath, () => {
              resolve(videoThumbnailResource)
            })
          })
          .screenshots({
            count: 1,
            filename: tmpThumbnailFileName,
            folder: tmpDir
          })
      } catch (err) {
        error(err.message)

        fs.unlink(tmpDownloadPath, () => {
          reject(err)
        })
      }
    })
  }
};
