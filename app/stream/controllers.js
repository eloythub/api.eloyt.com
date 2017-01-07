'use strict';

const Repository = require('./repository');
const fs         = require('fs');
const uuid       = require('uuid');
const https      = require('https');

module.exports = class Controllers {
  constructor(env) {
    this.env   = env;
    this.repos = new Repository(env);
  }

  videoUploadHandle(req, res) {
    const uploadFile           = req.payload.file;
    const userId               = req.payload.userId;
    const geoLocationLatitude  = req.payload.geoLocationLatitude;
    const geoLocationLongitude = req.payload.geoLocationLongitude;

    // Validate the File
    if (!uploadFile) {
      res({
        statusCode: 400,
        message: 'No file uploaded.',
      }).code(400);

      return;
    }

    // Validate the GEO location
    if (!geoLocationLatitude || !geoLocationLongitude) {
      res({
        statusCode: 400,
        message: 'GEO Location is missing.',
      }).code(400);

      return;
    }

    const uploadedFileName = uuid.v4() + '.mp4';
    const uploadedFilePath = __dirname + '/../../tmp/' + uploadedFileName;

    const fileStream = fs.createWriteStream(uploadedFilePath);

    fileStream.on('error', (err) => {
      res({
        statusCode: 500,
        err,
      }).code(500)

      return;
    });

    uploadFile.pipe(fileStream);

    uploadFile.on('end', (err) => {
      if (err) {
        res({
          statusCode: 500,
          err,
        }).code(500)

        return;
      }

      this.repos.uploadToGCLOUD(
        userId, 
        [ geoLocationLatitude, geoLocationLongitude ],
        uploadedFileName, 
        uploadedFilePath, 
        fileStream, 
        'video'
      ).then((gCloudStoragePath) => {
        fs.unlink(uploadedFilePath, () => {
          res({url: gCloudStoragePath});
        });
      }, (err) => {
        fs.unlink(uploadedFilePath, () => {
          res({
            statusCode: 500,
            error: err,
          }).code(500)
        });
      })
    });
  }

  streamResource(req, res) {
    const userId       = req.params.userId;
    const resourceId   = req.params.resourceId;
    const resourceType = req.params.resourceType;

    this.repos.findResource(userId, resourceId, resourceType)
      .then((resourceData) => {
        if (!resourceData) {
          res({
            statusCode: 404,
          }).code(404)

          return;
        }

        https.get(resourceData.resourceUrl, (proxyRes) => {
          // pipe the resourceUrl to response
          res(null, proxyRes).code(200);
        }).on('error', (message) => {
          res({
            statusCode: 500,
            message,
          }).code(500);
        });
      })
      .catch((error) => {
        res({
          statusCode: 500,
          message: 'something went wrong, please check the entries',
        }).code(500);
      })
  }

  produceStreamResources(req, res) {
    const userId = req.params.userId;
    const offset = req.params.offset;

    const args = {
      offset,
    };

    this.repos.produceStreamResource(userId, args)
      .then((resourceData) => {
        res({
          statusCode: 200,
          resourceData,
        }).code(200)
      })
      .catch((error) => {
        res({
          statusCode: 500,
          message: 'something went wrong, please check the entries',
        }).code(500);
      })
  }
}
