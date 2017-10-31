'use strict'

import debug from 'debug'
import Promise from 'promise'
import fs from 'fs'
import https from 'https'
import uuid from 'uuid'
import path from 'path'
import { format } from 'util'
import { URL } from 'url'
import configs from '../../Configs'
//import azure from 'azure-storage'
import GoogleStorage from '@google-cloud/storage'
import ResourceRepository from '../Repositories/ResourceRepository'
import ResourceTypesEnum from '../Enums/ResourceTypesEnum'

const googleStorage = GoogleStorage({
  projectId: configs.googleCloudProjectId,
  keyFilename: path.join(__dirname, '../../Keys/gcs/Eloyt-e42d521d7bad.json')
 }).bucket(configs.googleCloudStorageBucket)

//const blobService = azure.createBlobService(
//  configs.azureStorageAccountName,
//  configs.azureStorageKey
//)

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
              try {
                const resource = await StorageService.uploadTo(
                  tmpFileName,
                  tmpFilePath,
                  userId,
                  ResourceTypesEnum.avatar
                )

                fs.unlink(tmpFilePath, () => {
                  resolve(resource)
                })
              } catch (err) {
                fs.unlink(tmpFilePath, () => {
                  reject(err)
                })
              }
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

  static async uploadTo (fileName, filePath, userId, type) {
    return await this.uploadToGoogleCloudStorage(fileName, filePath, userId, type)
  }

  //static uploadToAzureStorage (fileName, filePath, userId, type) {
  //  const log = debug(`${configs.debugZone}:StorageService:uploadToAzureStorage`)
  //  const error = debug(`${configs.debugZone}:StorageService:uploadToAzureStorage:error`)
  //
  //  log('uploadToAzureStorage')
  //
  //  return new Promise((resolve, reject) => {
  //    try {
  //      // Create Container
  //      blobService.createContainerIfNotExists(type, {
  //        publicAccessLevel: 'blob'
  //      }, (err1) => {
  //        if (err1) {
  //          return reject(err1)
  //        }
  //
  //        // Upload file to container
  //        blobService.createBlockBlobFromLocalFile(type, fileName, filePath, async (err2) => {
  //          if (err2) {
  //            return reject(err2)
  //          }
  //
  //          // File has been uploaded
  //          const cloudUrl = StorageService.getAzureUrl(type, fileName)
  //
  //          const resource = await ResourceRepository.createResource(userId, type, cloudUrl, fileName)
  //
  //          if (resource) {
  //            return resolve(resource)
  //          }
  //
  //          blobService.deleteBlob(type, fileName, () => {
  //            error('create resource has been failed')
  //
  //            reject(new Error('create resource has been failed'))
  //          })
  //        })
  //      })
  //    } catch (err) {
  //      error(err.message)
  //
  //      return reject(err)
  //    }
  //  })
  //}

  static uploadToGoogleCloudStorage (fileName, filePath, userId, type) {
    const log   = debug(`${configs.debugZone}:StorageService:uploadToGoogleCloudStorage`)
    const error = debug(`${configs.debugZone}:StorageService:uploadToGoogleCloudStorage:error`)

    log('uploadToGoogleCloudStorage')

    return new Promise((resolve, reject) => {
      try {
        const fileDestination = path.join(type, fileName)

        googleStorage.upload(filePath, { destination: fileDestination}, async (err) => {
          if (err) {
            error(err.message)

            return reject(err)
          }

          try {
            googleStorage.file(fileDestination).makePublic()

            const cloudUrl = StorageService.getGCloudUrl(type, fileName)

            const resource = await ResourceRepository.createResource(userId, type, cloudUrl, fileName)

            if (!resource) {
              googleStorage.file(fileDestination).delete()

              error('create resource has been failed')

              return reject(new Error('create resource has been failed'))
            }

            resolve(resource)
          } catch (err) {
            googleStorage.file(fileDestination).delete()

            error(err.message)

            return reject(err)
          }
        })
      } catch (err) {
        error(err.message)

        return reject(err)
      }
    })
  }

  static getGCloudUrl (type, fileName) {
    return format(`https://storage.googleapis.com/${configs.googleCloudStorageBucket}/${type}/${fileName}`)
  }

  //static getAzureUrl (type, fileName) {
  //  return `https://${configs.azureStorageAccountName}.blob.core.windows.net/${type}/${fileName}`
  //}

  //static deleteVideoResourceFromAzure (videoResourceId) {
  //  const log = debug(`${configs.debugZone}:StorageService:deleteVideoResource`)
  //  const error = debug(`${configs.debugZone}:StorageService:deleteVideoResource:error`)
  //
  //  log('deleteVideoResource')
  //
  //  return new Promise(async (resolve, reject) => {
  //    try {
  //      const videoResource = await ResourceRepository.fetchResourceById(videoResourceId, ResourceTypesEnum.video)
  //
  //      blobService.deleteBlob(videoResource.type, videoResource.cloudFilename, async (err) => {
  //        if (err) {
  //          return reject(err)
  //        }
  //
  //        await ResourceRepository.deleteResource(videoResourceId)
  //
  //        resolve(true)
  //      })
  //    } catch (err) {
  //      error(err.message)
  //
  //      return reject(err)
  //    }
  //  })
  //}

  static deleteVideoResourceFromGCloud (videoResourceId) {
    const log   = debug(`${configs.debugZone}:StorageService:deleteVideoResourceFromGCloud`)
    const error = debug(`${configs.debugZone}:StorageService:deleteVideoResourceFromGCloud:error`)

    log('deleteVideoResourceFromGCloud')

    return new Promise(async (resolve, reject) => {
      try {
        const videoResource = await ResourceRepository.fetchResourceById(videoResourceId, ResourceTypesEnum.video)

        const fileDestination = path.join(ResourceTypesEnum.video, videoResource.cloudFilename)

        googleStorage.file(fileDestination).delete()

        await ResourceRepository.deleteResource(videoResourceId)

        resolve(true)
      } catch (err) {
        error(err.message)

        return reject(err)
      }
    })
  }
};
