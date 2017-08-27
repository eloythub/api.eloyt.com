'use strict'

import debug from 'debug'
import configs from '../../Configs'
import HashtagsRepository from '../Repositories/HashtagsRepository'

export default class HashtagsService {
  static async getAllHashtags () {
    const log = debug(`${configs.debugZone}:HashtagsService:getAllHashtags`)

    log('getAllHashtags')

    const hashtags = await HashtagsRepository.fetchAll()

    return hashtags
  }
}
