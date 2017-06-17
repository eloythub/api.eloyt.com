'use strict';

const BaseModel = require('../base-model');

module.exports = class ResourcesModel extends BaseModel {
  constructor(env) {
    super(env);

    this.model = this.registerSchema('resources', 'resources', {
      userId: {
        type: this.mongoose.Schema.ObjectId,
        ref: 'users'
      },
      geoLocation: {
        type: [Number],  // [<longitude>, <latitude>]
        index: '2d'      // create the geospatial index
      },
      resourceUrl: {
        type: String,
      },
      resourceType: {
        type: String,
      },
      thumbsUpCount: {
        type: Number,
        default: 0,
      },
      thumbsDownCount: {
        type: Number,
        default: 0,
      },
      viewsCount: {
        type: Number,
        default: 0,
      },
      description: {
        type: String,
      },
      hashtags: {
        type: Array,
        default: []
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    });
  }

  create(userId, geoLocation, resourceUrl, resourceType, description, hashtags) {
    const Model     = this.model;
    const Resources = new Model({
      userId: this.mongoose.Types.ObjectId(userId),
      geoLocation,
      resourceUrl,
      resourceType,
      description,
      hashtags,
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

  findResource(userId, resourceId, resourceType) {
    const Model = this.model;

    return new Promise((fulfill, reject) => {
      Model.find({
        _id: this.mongoose.Types.ObjectId(resourceId),
        userId: this.mongoose.Types.ObjectId(userId),
        resourceType: resourceType,
      }, (err, res) => {
        if (err) {
          reject(err);

          return;
        }

        fulfill(res[0] || null);
      });
    });
  }

  findResourceById(resourceId) {
    const Model = this.model;

    return new Promise((fulfill, reject) => {
      Model.find({
        _id: this.mongoose.Types.ObjectId(resourceId),
      }, (err, res) => {
        if (err) {
          reject(err);

          return;
        }

        fulfill(res[0] || null);
      });
    });
  }

  produceStreamResource(resourceType, offset) {
    const Model = this.model;

    return new Promise((fulfill, reject) => {
      Model.find({
          resourceType,
        })
        .select('_id userId')
        .lean()
        .populate({
          path: 'userId',
        })
        .limit(parseInt(offset))
        .sort({uploadedAt: 'desc'})
        .exec((err1, streamResources) => {
          if (err1) {
            reject(err1);

            return;
          }

          Model.populate(streamResources, {
            path: '_id userId.avatar',
            model: 'resources',
          }, (err2, res) => {
            if (err2) {
              reject(err2);

              return;
            }

            fulfill(streamResources);
          });
        });
    });
  }

  findOneStreamResourceById(resourceId) {
    const Model = this.model;

    return new Promise((fulfill, reject) => {
      Model.find({
          _id: this.mongoose.Types.ObjectId(resourceId),
        })
        .select('_id userId')
        .lean()
        .populate({
          path: 'userId',
        })
        .exec((err1, streamResources) => {
          if (err1) {
            reject(err1);

            return;
          }

          Model.populate(streamResources, {
            path: '_id userId.avatar',
            model: 'resources',
          }, (err2, res) => {
            if (err2) {
              reject(err2);

              return;
            }

            fulfill(streamResources);
          });
        });
    });
  }
};
