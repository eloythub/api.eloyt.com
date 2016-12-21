'use strict';

const BaseModel = require('../base-model');

module.exports = class ResourcesModel extends BaseModel {
  constructor(env) {
    super(env);

    const ObjectId = this.mongoose.Types.ObjectId

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
}
