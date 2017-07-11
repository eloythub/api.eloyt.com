'use strict';

module.exports = class ResourcesReactsModel {
  constructor(env) {
    this.model = this.registerSchema('resources_react', 'resources_react', {
      resourceId: {
        type: this.mongoose.Schema.ObjectId,
        ref: 'resources'
      },
      resourceOwnerUserId: {
        type: this.mongoose.Schema.ObjectId,
        ref: 'users'
      },
      resourceReactedByUserId: {
        type: this.mongoose.Schema.ObjectId,
        ref: 'users'
      },
      reactType: {
        type: String,
      },
      reactedAt: {
        type: Date,
        default: Date.now,
      },
    });
  }

  createReactLike(resourceReactedByUserId, resourceId, resourceOwnerUserId) {
    return this.create(resourceReactedByUserId, resourceId, resourceOwnerUserId, 'like');
  }

  createReactDislike(resourceReactedByUserId, resourceId, resourceOwnerUserId) {
    return this.create(resourceReactedByUserId, resourceId, resourceOwnerUserId, 'dislike');
  }
  createReactSkip(resourceReactedByUserId, resourceId, resourceOwnerUserId) {
    return this.create(resourceReactedByUserId, resourceId, resourceOwnerUserId, 'skip');
  }

  create(resourceReactedByUserId, resourceId, resourceOwnerUserId, reactType) {
    const Model           = this.model;
    const ResourcesReacts = new Model({resourceReactedByUserId, resourceId, resourceOwnerUserId, reactType});

    return new Promise((fulfill, reject) => {
      return ResourcesReacts.save((err, res) => {
        if (err) {
          reject(err);

          return;
        }

        return fulfill(res);
      });
    });
  }
};
