'use strict';

const BaseModel = require('../base-model');

module.exports = class ResourcesViewsModel extends BaseModel {
  constructor(env) {
    super(env);

    this.model = this.registerSchema('resources_views', 'resources_views', {
      resourceId: {
        type: this.mongoose.Schema.ObjectId,
        ref: 'resources'
      },
      resourceOwnerUserId: {
        type: this.mongoose.Schema.ObjectId,
        ref: 'users'
      },
      resourceViewedByUserId: {
        type: this.mongoose.Schema.ObjectId,
        ref: 'users'
      },
      viewedAt: {
        type: Date,
        default: Date.now,
      },
    });
  }
};
