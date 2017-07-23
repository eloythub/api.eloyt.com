'use strict'

import debug from 'debug'
import configs from '../../Configs'
import * as Models from '../Models'

export default class ResourceRepository {
  static async createResource (userId, type, cloudUrl) {
    const log = debug(`${configs.debugZone}:UsersRepository:createResource`)

    log('createResource')

    const resource = await Models.Resources.create({ userId, type, cloudUrl })

    if (!resource) {
      return null
    }

    return resource.dataValues
  }
};
