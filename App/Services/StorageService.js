'use strict'

import debug from 'debug'
import Promise from 'promise'
import fs from 'fs'
import https from 'https'
import uuid from 'uuid'
import path from 'path'
import { URL } from 'url'
import configs from '../../Configs'
import azure from 'azure-storage'
// import GoogleStorage from '@google-cloud/storage'
import ResourceRepository from '../Repositories/ResourceRepository'
import ResourceTypesEnum from '../Enums/ResourceTypesEnum'

// const googleStorage = GoogleStorage({
//  projectId: configs.googleCloudProjectId,
//  keyFilename: path.join(__dirname, '../../Keys/gcs/Eloyt-234bb463581d.json')
// }).bucket(configs.googleCloudStorageBucket)

const blobService = azure.createBlobService(
  configs.azureStorageAccountName,
  configs.azureStorageKey
)

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
      try {
        https.get(new URL(url), (res) => {
          if (parseInt(res.statusCode) !== 200) {
            error('failed to fetch picture from facebook')

            fs.unlink(tmpFilePath, () => {
              reject(new Error('failed to fetch picture from facebook'))
            })

            return
          }

          res.pipe(fileStream)

          fileStream.on('finish', () => {
            fileStream.close(async () => {
              const resource = await StorageService.uploadToAzureStorage(
                tmpFileName,
                tmpFilePath,
                userId,
                ResourceTypesEnum.avatar
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
      } catch (err) {
        error(err.message)

        fs.unlink(tmpFilePath, () => {
          reject(err)
        })
      }
    })
  }

  static uploadToAzureStorage (fileName, filePath, userId, type) {
    const log = debug(`${configs.debugZone}:StorageService:uploadToAzureStorage`)
    const error = debug(`${configs.debugZone}:StorageService:uploadToAzureStorage:error`)

    log('uploadToAzureStorage')

    return new Promise((resolve, reject) => {
      try {
        // Create Container
        blobService.createContainerIfNotExists(type, {
          publicAccessLevel: 'blob'
        }, (err1) => {
          if (err1) {
            return reject(err1)
          }

          // Upload file to container
          blobService.createBlockBlobFromLocalFile(type, fileName, filePath, async (err2) => {
            if (err2) {
              return reject(err2)
            }

            // File has been uploaded
            const cloudUrl = StorageService.getAzureUrl(type, fileName)

            const resource = await ResourceRepository.createResource(userId, type, cloudUrl, fileName)

            if (resource) {
              return resolve(resource)
            }

            blobService.deleteBlob(type, fileName, () => {
              error('create resource has been failed')

              reject(new Error('create resource has been failed'))
            })
          })
        })
      } catch (err) {
        error(err.message)

        return reject(err)
      }
    })
  }

  static getAzureUrl (type, fileName) {
    return `https://${configs.azureStorageAccountName}.blob.core.windows.net/${type}/${fileName}`
  }

  static deleteVideoResource (videoResourceId) {
    const log = debug(`${configs.debugZone}:StorageService:deleteVideoResource`)
    const error = debug(`${configs.debugZone}:StorageService:deleteVideoResource:error`)

    log('deleteVideoResource')

    return new Promise(async (resolve, reject) => {
      try {
        const videoResource = await ResourceRepository.fetchResourceById(videoResourceId, ResourceTypesEnum.video)

        blobService.deleteBlob(videoResource.type, videoResource.cloudFilename, async (err) => {
          if (err) {
            return reject(err)
          }

          await ResourceRepository.deleteResource(videoResourceId)

          resolve(true)
        })
      } catch (err) {
        error(err.message)

        return reject(err)
      }
    })
  }
};
