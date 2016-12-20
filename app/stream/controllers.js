'use strict';

const Repository = require('./repository');
const fs         = require('fs');
const uuid       = require('uuid');

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
}
