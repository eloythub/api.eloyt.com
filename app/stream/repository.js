'use strict';

const format  = require('util').format;
const Promise = require('promise');

const ResourcesModel = require('../models/resources');

module.exports = class Repository {
  constructor(env) {
    this.env = env;

    this.resourcesModel = new ResourcesModel(env);

    this.storage = require('@google-cloud/storage')({
      projectId: this.env.googleCloudProjectId,
      keyFilename: 'keys/gcs/Eloyt-234bb463581d.json',
    });


    this.bucket = this.storage.bucket(this.env.googleCloudStorageBucket);
  }

  uploadToGCLOUD(userId, geoLocation, fileName, filePath, fileStream, resourceType) {
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

          const resourceUrl = format(`https://storage.googleapis.com/${this.env.googleCloudStorageBucket}/${fileName}`);

          // add into database resources
          this.resourcesModel.create(userId, geoLocation, resourceUrl, resourceType)
            .then(fulfill)
            .catch((err) => {
              // Delete file from the gcs bucket incase of failure
              this.bucket.file(fileName).delete();

              reject(err);
            });
        });
      });
    });
  }
}
