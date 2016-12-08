'use strict';

const format  = require('util').format;
const Promise = require('promise');

module.exports = class Repository {
  constructor(env) {
    this.env = env;

    this.storage = require('@google-cloud/storage')({
      projectId: this.env.googleCloudProjectId,
      keyFilename: 'keys/gcs/Eloyt-234bb463581d.json',
    });


    this.bucket = this.storage.bucket(this.env.googleCloudStorageBucket);
  }

  uploadToGCLOUD(fileName, filePath, fileStream) {
    return new Promise((fulfill, reject) => {
      this.bucket.upload(filePath, (err) => {
        if (err) {
          reject(err);

          return;
        }

        // Give read access to all the users
        this.bucket.file(fileName).acl.readers.addAllUsers((aclError) => {
          if (aclError) {
            // Delete file from the gcs bucket incase of failure
            this.bucket.file(fileName).delete();

            reject(aclError);

            return;
          }

          // Return the access Url
          fulfill(format(`https://storage.googleapis.com/${this.env.googleCloudStorageBucket}/${fileName}`));
        });
      });
    });
  }
}
