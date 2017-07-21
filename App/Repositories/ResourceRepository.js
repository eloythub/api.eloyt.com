'use strict'

import debug from 'debug'
import configs from '../../Configs'
import * as Models from '../Models'

export default class ResourceRepository {
  static async createResource (userId, type, cloudUrl, geoLocation) {
    const log = debug(`${configs.debugZone}:UsersRepository:createResource`)

    log('createResource')

    const resource = await Models.Resources.create({ userId, type, cloudUrl, geoLocation })

    if (!resource) {
      return null
    }

    return resource.dataValues
  }
};
