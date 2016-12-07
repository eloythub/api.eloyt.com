'use strict';

const format     = require('util').format;
module.exports = class Repository {
  constructor(env) {
    this.env = env;

    this.storage = require('@google-cloud/storage')({
      projectId: this.env.googleCloudProjectId,
    });
  }

  uploadToGCLOUD() {

    //const bucket     = storage.bucket(this.env.googleCloudStorageBucket);
  }
}
