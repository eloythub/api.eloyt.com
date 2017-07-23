'use strict'

import debug from 'debug'
import configs from '../../Configs'
import ReactRepository from '../Repositories/ReactRepository'

export default class StreamService {
  static async reactToResource (userId, resourceId, type) {
    const log = debug(`${configs.debugZone}:StreamService:reactToResource`)

    log('reactToResource')

    const isAlreadyReacted = await ReactRepository.isAlreadyReacted(userId, resourceId, type)

    if (isAlreadyReacted) {
      const data = await ReactRepository.fetchReactByAttributes({userId, resourceId, type})

      return { data, action: 'find' }
    }

    const data = await ReactRepository.createReact(userId, resourceId, type)

    return { data, action: 'create' }
  }
};
