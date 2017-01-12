'use strict';

const BaseModel = require('../base-model');

module.exports = class ResourcesStatisticsModel extends BaseModel {
  constructor(env) {
    super(env);

    this.model = this.registerSchema('resources_statistics', 'resources_statistics', {
      userId: {
        type: this.mongoose.Schema.ObjectId,
        ref: 'users',
      },
      resourceId: {
        type: this.mongoose.Schema.ObjectId,
        ref: 'resources',
      },
      countThumbsUp: {
        type: Number,
        default: 0,
      },
      countThumbsDown: {
        type: Number,
        default: 0,
      },
      countViews: {
        type: Number,
        default: 0,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });
  }
};
