'use strict'

import * as Models from '../Models'

export default class ResourceRepository {
  static async createResource (userId, type, cloudUrl, geoLocation) {
    const resource = await Models.Resources.create({ userId, type, cloudUrl, geoLocation })

    if (!resource) {
      return null
    }

    return resource.dataValues
  }
};
