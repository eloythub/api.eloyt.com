'use strict';

const ResourcesModel = require('./resources');

module.exports = class ResourcesVideoThumbnailsModel {
  constructor(env) {
    this.model = this.registerSchema('resources_video_thumbnail', 'resources_video_thumbnail', {
      sourceResourceId: {
        type: this.mongoose.Schema.ObjectId,
        ref: 'resources'
      },
      thumbnailResourceId: {
        type: this.mongoose.Schema.ObjectId,
        ref: 'resources'
      },
      imageSize: {
        type: String,
        default: 'original',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });

    this.resourcesModel = new ResourcesModel(env);
  }

  findResource(sourceResourceId, imageSize) {
    const Model = this.model;

    return new Promise((fulfill, reject) => {
      Model.find({
        sourceResourceId: this.mongoose.Types.ObjectId(sourceResourceId),
        imageSize,
      }, (err, res) => {
        if (err) {
          reject(err);

          return;
        }

        if (!res) {
          reject(null);

          return;
        }

        if (typeof res[0] !== 'object') {
          reject('no-thumbnail-found');

          return;
        }

        this.resourcesModel.findResourceById(res[0].thumbnailResourceId).then(fulfill, reject);
      });
    });
  }

  create(sourceResourceId, thumbnailResourceId, imageSize) {
    const Model     = this.model;
    const Resources = new Model({
      sourceResourceId: this.mongoose.Types.ObjectId(sourceResourceId),
      thumbnailResourceId: this.mongoose.Types.ObjectId(thumbnailResourceId),
      imageSize,
    });

    return new Promise((fulfill, reject) => {
      Resources.save((err, res) => {
        if (err) {
          reject(err);

          return;
        }

        fulfill(res);
      });
    });
  }
};
