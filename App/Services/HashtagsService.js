'use strict'

import debug from 'debug'
import configs from '../../Configs'
import HashtagsRepository from '../Repositories/HashtagsRepository'
import UsersHashtagsRepository from '../Repositories/UsersHashtagsRepository'

export default class HashtagsService {
  static async getAllHashtags () {
    const log = debug(`${configs.debugZone}:HashtagsService:getAllHashtags`)

    log('getAllHashtags')

    const hashtags = await HashtagsRepository.fetchAll()

    return hashtags
  }

  static async updateUserHashtags (userId, ids) {
    const log = debug(`${configs.debugZone}:HashtagsService:updateUserHashtags`)

    log('updateUserHashtags')

    // validate hashtags
    const idsHashtags = await HashtagsRepository.fetchAllByIds(ids)

    if (idsHashtags.length !== ids.length) {
      throw new Error('ids are not valid')
    }

    // remove user hashtags
    await UsersHashtagsRepository.flushUserHashtags(userId)

    // insert user hashtags
    await UsersHashtagsRepository.addUserHashtags(userId, ids)

    return true
  }
}
