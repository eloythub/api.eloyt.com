'use strict'

import debug from 'debug'
import configs from '../../Configs'
import * as Models from '../Models'

export default class HashtagsRepository {
  static async fetchIdBySlug (slug) {
    const log = debug(`${configs.debugZone}:HashtagsRepository:fetchIdBySlug`)

    log('fetchIdBySlug')

    const hashtag = await Models.Hashtags.findOne({ where: { slug } })

    if (!hashtag) {
      return null
    }

    return hashtag.id
  }
}
