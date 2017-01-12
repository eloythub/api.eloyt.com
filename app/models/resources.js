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
      resourceStatisticId: {
        type: this.mongoose.Schema.ObjectId,
        ref: 'resources_statistics'
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
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    });
  }

  create(userId, geoLocation, resourceUrl, resourceType) {
    const Model     = this.model;
    const Resources = new Model({
      userId: this.mongoose.Types.ObjectId(userId),
      geoLocation,
      resourceUrl,
      resourceType,
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

  produceStreamResource(userId, args) {
    const Model = this.model;

    const resourceType = args['resourceType'] || 'video';
    const offset       = args['offset'] || 20;

    return new Promise((fulfill, reject) => {
      Model.find({
          // userId: this.mongoose.Types.ObjectId(userId),
          resourceType,
        })
        .lean()
        .populate({path: 'userId'})
        .limit(parseInt(offset))
        .exec((err1, streamResources) => {
          if (err1) {
            reject(err1);

            return;
          }

          Model.populate(streamResources, {
            path: 'userId.avatar',
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
