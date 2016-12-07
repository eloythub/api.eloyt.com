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

    const name = uuid.v4() + '.mp4';
    const path = __dirname + '/../../tmp/' + name;

    const file = fs.createWriteStream(path);

    file.on('error', function (err) {
      console.error(err)
    });

    uploadFile.pipe(file);

    uploadFile.on('end', function (err) {
      if (err) {
        res(err).code(500)
      }

      res({fileName: name});
    });
  }
}
