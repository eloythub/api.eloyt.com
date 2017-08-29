'use strict'

import debug from 'debug'
import configs from '../../Configs'
import * as Models from '../Models'

export default class UsersHashtagsRepository {
  static async flushUserHashtags (userId) {
    const log = debug(`${configs.debugZone}:UsersHashtagsRepository:flushUserHashtags`)

    log('flushUserHashtags')

    const userHashtag = await Models.UsersHashtags.destroy({where: {userId}})

    return userHashtag
  }

  static async addUserHashtags (userId, ids) {
    const log = debug(`${configs.debugZone}:UsersHashtagsRepository:addUserHashtags`)

    log('addUserHashtags')

    let bulkUserHashtags = []

    for (const hashtagId of ids) {
      bulkUserHashtags.push({userId, hashtagId})
    }

    const bulkUserHashtagsResponse = await Models.UsersHashtags.bulkCreate(bulkUserHashtags)

    if (!bulkUserHashtagsResponse) {
      throw new Error('failed to add user hashtags')
    }

    return true
  }
};
