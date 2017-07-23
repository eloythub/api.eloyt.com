'use strict'

const format = require('util').format
const Promise = require('promise')
const fs = require('fs')
const https = require('https')
const uuid = require('uuid')
const path = require('path')

const ResourcesModel = require('../models-mongo/resources')
const ResourcesReactsModel = require('../models-mongo/resources-reacts')
const ResourcesVideoThumbnailsModel = require('../models-mongo/resources-video-thumbnails')

export default class StreamRepository {
  constructor (env) {
    this.env = env

    this.resourcesModel = new ResourcesModel(env)
    this.resourcesReactsModel = new ResourcesReactsModel(env)
    this.resourcesVideoThumbnailsModel = new ResourcesVideoThumbnailsModel(env)

    this.storage = require('@google-cloud/storage')({
      projectId: this.env.googleCloudProjectId,
      keyFilename: 'keys/gcs/Eloyt-234bb463581d.json'
    })

    this.bucket = this.storage.bucket(this.env.googleCloudStorageBucket)
  }

  uploadToGCLOUDFromUrl (url, fileExtention, userId, geoLocation, resourceType, description, hashtags = []) {
    return new Promise((resolve, reject) => {
      const tmpFileName = uuid.v4() + '.' + fileExtention
      const tmpFilePath = path.join(__dirname, '/../../tmp/', tmpFileName)

      const fileStream = fs.createWriteStream(tmpFilePath)
      https.get(url, (response) => {
        response.pipe(fileStream)

        fileStream.on('finish', () => {
          fileStream.close(() => {
            this.uploadToGCLOUD(userId, geoLocation, tmpFileName, tmpFilePath, fileStream, resourceType, description, hashtags)
              .then((res) => {
                fs.unlink(tmpFilePath)

                resolve(res)
              })
              .catch(reject)
          })
        })
      }).on('error', (err) => {
        fs.unlink(tmpFilePath)

        reject(err)
      })
    })
  };

  uploadToGCLOUD (userId, geoLocation, fileName, filePath, fileStream, resourceType, description, hashtags = []) {
    return new Promise((resolve, reject) => {
      this.bucket.upload(filePath, (err) => {
        if (err) {
          reject(err)

          return
        }

        // Give read access to all the users
        this.bucket.file(fileName).acl.readers.addAllUsers((aclError) => {
          if (aclError) {
            // Delete file from the gcs bucket in case of failure
            this.bucket.file(fileName).delete()

            reject(aclError)

            return
          }

          const resourceUrl = format(`https://storage.googleapis.com/${this.env.googleCloudStorageBucket}/${fileName}`)

          // Add into database resources
          this.resourcesModel.create(userId, geoLocation, resourceUrl, resourceType, description, hashtags)
            .then(resolve)
            .catch((err) => {
              // Delete file from the gcs bucket in case of failure
              this.bucket.file(fileName).delete()

              reject(err)
            })
        })
      })
    })
  }

  findResource (userId, resourceId, resourceType) {
    return this.resourcesModel.findResource(userId, resourceId, resourceType)
  }

  findResourceThumb (resourceId, imageSize) {
    return this.resourcesVideoThumbnailsModel.findResource(resourceId, imageSize)
  }

  produceStreamResource (userId, args) {
    const resourceType = args['resourceType'] || 'video'
    const offset = args['offset'] || 20

    return this.resourcesModel.produceStreamResource(resourceType, offset)
  }

  produceOneStreamResourceById (resourceId) {
    return this.resourcesModel.findOneStreamResourceById(resourceId)
  }

  createThumbnailRecord (sourceResourceId, thumbnailResourceId, imageSize) {
    return this.resourcesVideoThumbnailsModel.create(sourceResourceId, thumbnailResourceId, imageSize)
  }
};
