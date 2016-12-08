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
    const uploadFile = req.payload.file;

    if (!uploadFile) {
      res({
        statusCode: 400,
        message: 'No file uploaded.',
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

      this.repos.uploadToGCLOUD(uploadedFileName, uploadedFilePath, fileStream).then((gCloudStoragePath) => {
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
