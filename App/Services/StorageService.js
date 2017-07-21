'use strict'

import debug from 'debug'
import Promise from 'promise'
import { format } from 'util'
import fs from 'fs'
import https from 'https'
import uuid from 'uuid'
import path from 'path'
import configs from '../../Configs'
import GoogleStorage from '@google-cloud/storage'
import ResourceRepository from '../Repositories/ResourceRepository'
import ResourceTypesEnum from '../Enums/ResourceTypesEnum'

const googleStorage = GoogleStorage({
  projectId: configs.googleCloudProjectId,
  keyFilename: path.join(__dirname, '../../Keys/gcs/Eloyt-234bb463581d.json')
}).bucket(configs.googleCloudStorageBucket)

export default class StorageService {
  static downloadPictureFromFacebookAndUploadToCloud (userId, profilePicture) {
    const log = debug(`${configs.debugZone}:StorageService:downloadPictureFromFacebookAndUploadToCloud`)
    const error = debug(`${configs.debugZone}:StorageService:downloadPictureFromFacebookAndUploadToCloud:error`)

    log('downloadPictureFromFacebookAndUploadToCloud')

    const {url} = profilePicture.data

    const tmpFileName = `${uuid.v4()}.jpg`
    const tmpFilePath = path.join(__dirname, '/../../tmp/', tmpFileName)

    const fileStream = fs.createWriteStream(tmpFilePath)

    return new Promise((resolve, reject) => {
      // Get file from Facebook and store it into tmp directory
      https.get(url, (response) => {
        response.pipe(fileStream)

        fileStream.on('finish', () => {
          fileStream.close(async () => {
            const resource = await StorageService.uploadToGoogleCloudStorage(
              tmpFileName,
              tmpFilePath,
              userId,
              ResourceTypesEnum.avatar,
              null
            )

            fs.unlink(tmpFilePath, () => {
              resolve(resource)
            })
          })
        })
      }).on('error', (err) => {
        error(err.message)

        fs.unlink(tmpFilePath, () => {
          reject(err)
        })
      })
    })
  }

  static uploadToGoogleCloudStorage (fileName, filePath, userId, type, geoLocation) {
    const log = debug(`${configs.debugZone}:StorageService:uploadToGoogleCloudStorage`)
    const error = debug(`${configs.debugZone}:StorageService:uploadToGoogleCloudStorage:error`)


    log('uploadToGoogleCloudStorage')

    return new Promise((resolve, reject) => {
      googleStorage.upload(filePath, (err) => {
        if (err) {
          error(err.message)

          return reject(err)
        }

        // Give read access to all the users
        googleStorage.file(fileName)
          .acl
          .readers
          .addAllUsers(async (aclError) => {
            if (aclError) {
              // Delete file from the gcs bucket in case of failure
              googleStorage.file(fileName).delete()

              error(aclError)

              return reject(aclError)
            }

            const cloudUrl = format(`https://storage.googleapis.com/${configs.googleCloudStorageBucket}/${fileName}`)

            const resource = await ResourceRepository.createResource(userId, type, cloudUrl, geoLocation)

            if (!resource) {
              this.bucket.file(fileName).delete()

              error('create resource has been failed')

              return reject(new Error('create resource has been failed'))
            }

            resolve(resource)
          })
      })
    })
  }
};
