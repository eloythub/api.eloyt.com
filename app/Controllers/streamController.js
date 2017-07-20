'use strict'

import StreamRepository from '../Repositories/ResourceRepository'
import StreamTransformer from '../Transformers/StreamTransformer'

const fs = require('fs')
const uuid = require('uuid')
const https = require('https')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')

export default class StreamController {
  constructor (env) {
    this.env = env
    this.repos = new StreamRepository(env)
    this.transformer = new StreamTransformer()
  }

  static videoUploadHandle (req, res) {
    const uploadFile = req.payload.file
    const userId = req.payload.userId
    const description = req.payload.description
    const hashtagsRaw = req.payload.hashtags
    const geoLocationLatitude = req.payload.geoLocationLatitude
    const geoLocationLongitude = req.payload.geoLocationLongitude

    // Validate the File
    if (!uploadFile) {
      return res({
        statusCode: 400,
        message: 'No file uploaded.'
      }).code(400)
    }

    // Validate the Description
    if (!description) {
      return res({
        statusCode: 400,
        message: `description is missing.`
      }).code(400)
    }

    // Validate the Interests
    const hashtags = hashtagsRaw.split(',')

    if (!(hashtags.length >= 3 && hashtags.length <= 5)) {
      return res({
        statusCode: 400,
        message: `hashtags must be in range of 3 to 5. ${hashtags.length} inserted.`
      }).code(400)
    }

    // Validate the GEO location
    if (!geoLocationLatitude || !geoLocationLongitude) {
      res({
        statusCode: 400,
        message: 'GEO Location is missing.'
      }).code(400)

      return
    }

    const uploadedFileName = uuid.v4() + '.mp4'
    const uploadedFilePath = path.join(__dirname, '/../../tmp/', uploadedFileName)

    const fileStream = fs.createWriteStream(uploadedFilePath)

    fileStream.on('error', (err) => {
      res({
        statusCode: 500,
        err
      }).code(500)
    })

    uploadFile.pipe(fileStream)

    uploadFile.on('end', (err) => {
      if (err) {
        res({
          statusCode: 500,
          error: err
        }).code(500)

        return
      }

      this.repos.uploadToGCLOUD(
        userId,
        [geoLocationLatitude, geoLocationLongitude],
        uploadedFileName,
        uploadedFilePath,
        fileStream,
        'video',
        description,
        hashtags
      ).then((uploadedVideo) => {
        fs.unlink(uploadedFilePath, () => {
          res(uploadedVideo)
        })
      }, (error) => {
        fs.unlink(uploadedFilePath, () => {
          res({
            statusCode: 500,
            error
          }).code(500)
        })
      })
    })
  }

  static streamResource (req, res) {
    const userId = req.params.userId
    const resourceId = req.params.resourceId
    const resourceType = req.params.resourceType

    this.repos.findResource(userId, resourceId, resourceType)
      .then((resourceData) => {
        if (!resourceData) {
          res({
            statusCode: 404
          }).code(404)

          return
        }

        https.get(resourceData.resourceUrl, (proxyRes) => {
          // pipe the resourceUrl to response
          res(null, proxyRes).code(200)
        }).on('error', (error) => {
          res({
            statusCode: 500,
            error
          }).code(500)
        })
      })
      .catch((error) => {
        res({
          statusCode: 500,
          error
        }).code(500)
      })
  }

  static streamThumbnailResource (req, res) {
    const userId = req.params.userId
    const resourceId = req.params.resourceId
    const resourceType = req.params.resourceType
    const imageSize = req.params.imageSize

    if (resourceType !== 'video') {
      return res({
        statusCode: 500,
        error: {
          message: 'At the moment only accept\'s the video as resource'
        }
      }).code(500)
    }

    this.repos.findResource(userId, resourceId, resourceType)
      .then((resource) => {
        if (!resource) {
          return res({
            statusCode: 404
          }).code(404)
        }

        this.repos.findResourceThumb(resourceId, imageSize)
          .then((thumbResource) => {
            if (!thumbResource) {
              return res({
                statusCode: 404
              }).code(404)
            }

            https.get(thumbResource.resourceUrl, (proxyRes) => {
              // pipe the resourceUrl to response
              res(null, proxyRes).code(200)
            }).on('error', (error) => {
              res({
                statusCode: 500,
                error
              }).code(500)
            })
          })
          .catch((error) => {
            if (error === 'no-thumbnail-found') {
              // It needs to generate the thumbnail here and upload to cloud storage
              // then pipe the uploaded resource from cloud storage to response here
              return this.generateThumbnailFromLink(res, resource, imageSize)
            }

            res({
              statusCode: 500,
              error
            }).code(500)
          })
      })
      .catch((error) => {
        res({
          statusCode: 500,
          error
        }).code(500)
      })
  }

  static generateThumbnailFromLink (res, resource, imageSize) {
    const tmpDir = '/opt/app/tmp'
    const tmpDownloadDir = tmpDir + '/' + uuid.v4() + '.mp4'
    const tmpThumbnailFileName = uuid.v4() + '.png'
    const tmpThumbnailDir = tmpDir + '/' + tmpThumbnailFileName

    const file = fs.createWriteStream(tmpDownloadDir)

    https.get(resource.resourceUrl, (response) => {
      response.pipe(file)

      file.on('finish', () => {
        // pipe the resourceUrl to response
        ffmpeg(tmpDownloadDir)
          .on('error', (error) => {
            console.log('error:', error)

            fs.unlink(tmpDownloadDir)

            res({
              statusCode: 500,
              error
            }).code(500)
          })
          .on('end', () => {
            // Upload the thumbnail to the server
            this.repos.uploadToGCLOUD(
              null, // userId,
              null,
              tmpThumbnailFileName,
              tmpDir + '/' + tmpThumbnailFileName,
              file,
              'thumbnail'
            ).then((thumbnailResource) => {
              file.close()

              fs.unlink(tmpThumbnailDir)
              fs.unlink(tmpDownloadDir, () => {
                // Store Thumbnail into DB
                this.repos.createThumbnailRecord(resource._id, thumbnailResource._id, 'original')
                  .then(() => {
                    // Download the thumbnail from cloud storage and pipe to response
                    https.get(thumbnailResource.resourceUrl, (proxyRes) => {
                      // pipe the resourceUrl to response
                      res(null, proxyRes).code(200)
                    }).on('error', (error) => {
                      res({
                        statusCode: 500,
                        error
                      }).code(500)
                    })
                  })
                  .catch((error) => {
                    res({
                      statusCode: 500,
                      error
                    }).code(500)
                  })
              })
            }, (error) => {
              file.close()

              fs.unlink(tmpThumbnailDir)
              fs.unlink(tmpDownloadDir, () => {
                res({
                  statusCode: 500,
                  error
                }).code(500)
              })
            })
          })
          .screenshots({
            count: 1,
            filename: tmpThumbnailFileName,
            folder: tmpDir
          })
      })
    }).on('error', (error) => {
      fs.unlink(tmpDownloadDir)

      res({
        statusCode: 500,
        error
      }).code(500)
    })
  }

  static produceStreamResources (req, res) {
    const userId = req.params.userId
    const offset = req.params.offset

    const args = {
      offset
    }

    this.repos.produceStreamResource(userId, args)
      .then((data) => {
        res({
          statusCode: 200,
          data: this.transformer.produceStreamResources(data)
        }).code(200)
      })
      .catch((error) => {
        res({
          statusCode: 500,
          error
        }).code(500)
      })
  }

  static produceOneStreamResourceById (req, res) {
    const {resourceId} = req.params

    this.repos.produceOneStreamResourceById(resourceId)
      .then((data) => {
        res({
          statusCode: 200,
          data: this.transformer.produceStreamResources(data)[0]
        }).code(200)
      })
      .catch((error) => {
        res({
          statusCode: 500,
          error
        }).code(500)
      })
  }

  static streamResourceReact (req, res) {
    const {userId, resourceId, resourceOwnerUserId, reactType} = req.params

    let response

    switch (reactType) {
      case 'like':
        response = this.repos.resourceReactLike(userId, resourceId, resourceOwnerUserId)
        break
      case 'dislike':
        response = this.repos.resourceReactDislike(userId, resourceId, resourceOwnerUserId)
        break
      case 'skip':
        response = this.repos.resourceReactSkip(userId, resourceId, resourceOwnerUserId)
        break
    }

    if (!response) {
      return res({
        statusCode: 500,
        error: 'react type is wrong or empty'
      }).code(500)
    }

    return response.then((data) => {
      return res({
        statusCode: 200,
        data
      }).code(200)
    })
      .catch((error) => {
        return res({
          statusCode: 500,
          error
        }).code(500)
      })
  }
};
