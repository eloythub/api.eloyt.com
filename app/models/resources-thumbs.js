'use strict';

const BaseModel = require('../base-model');

module.exports = class ResourcesThumbsModel extends BaseModel {
  constructor(env) {
    super(env);

    const ObjectId = this.mongoose.Types.ObjectId

    this.model = this.registerSchema('resources_thumbs', 'resources_thumbs', {
      resourceId: {
        type: this.mongoose.Schema.ObjectId,
        ref: 'resources'
      },
      resourceOwnerUserId: {
        type: this.mongoose.Schema.ObjectId,
        ref: 'users'
      },
      resourceThumbedByUserId: {
        type: this.mongoose.Schema.ObjectId,
        ref: 'users'
      },
      thumbType: {
        type: String,
      },
      thumbedAt: {
        type: Date,
        default: Date.now,
      },
    });
  }
}
