'use strict'

import debug from 'debug'
import configs from '../../Configs'
import * as Models from '../Models'

export default class ResourceRepository {
  static async fetchResourceById (id) {
    const log = debug(`${configs.debugZone}:ResourceRepository:fetchResourceById`)

    log('fetchResourceById')

    const resource = await Models.Resources.findOne({ where: { id } })

    if (!resource) {
      return null
    }

    return resource.dataValues
  }

  static async createResource (userId, type, cloudUrl, cloudFilename) {
    const log = debug(`${configs.debugZone}:UsersRepository:createResource`)

    log('createResource')

    const resource = await Models.Resources.create({ userId, type, cloudUrl, cloudFilename })

    if (!resource) {
      return null
    }

    return resource.dataValues
  }

  static async deleteResource (id) {
    const log = debug(`${configs.debugZone}:UsersRepository:deleteResource`)

    log('deleteResource')

    const resource = await Models.Resources.destroy({where: {id}})

    return resource
  }
};
