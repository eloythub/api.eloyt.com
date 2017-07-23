'use strict'

import debug from 'debug'
import configs from '../../Configs'
import * as Models from '../Models'

export default class ReactRepository {
  static async createReact (userId, resourceId, type) {
    const log = debug(`${configs.debugZone}:ReactRepository:createReact`)

    log('createReact')

    const react = await Models.React.create({ userId, resourceId, type })

    if (!react) {
      return null
    }

    return react.dataValues
  }

  static async isAlreadyReacted (userId, resourceId, type) {
    const log = debug(`${configs.debugZone}:ReactRepository:isAlreadyReacted`)

    log('isAlreadyReacted')

    const reactCount = await Models.React.count({ where: { userId, resourceId, type } })

    return reactCount !== 0
  }

  static async fetchReactByAttributes (attributes) {
    const log = debug(`${configs.debugZone}:ReactRepository:fetchReactByAttributes`)

    log('fetchReactByAttributes')

    const react = await Models.React.findOne({ where: attributes })

    if (!react) {
      return null
    }

    return react.dataValues
  }
};
