'use strict'

import Promise from 'promise'
import fs from 'fs'
import https from 'https'
import uuid from 'uuid'
import path from 'path'

export default class StorageService {
  static downloadProfilePicture (userId, profilePicture) {
    const {url} = profilePicture.data

    const tmpFileName = `${uuid.v4()}.jpg`
    const tmpFilePath = path.join(__dirname, '/../../tmp/', tmpFileName)

    const fileStream = fs.createWriteStream(tmpFilePath)

    return new Promise((resolve, reject) => {
      // Get file from Facebook and store it into tmp directory
      https.get(url, (response) => {
        response.pipe(fileStream)

        fileStream.on('finish', () => {
          fileStream.close(() => {
            StorageService.uploadToGoogleCloudStorage()
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
  }

  static uploadToGoogleCloudStorage () {

  }
};
