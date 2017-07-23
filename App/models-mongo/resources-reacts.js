'use strict'

module.exports = class ResourcesReactsModel {
  constructor (env) {
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
        type: String
      },
      reactedAt: {
        type: Date,
        default: Date.now
      }
    })
  }
}
