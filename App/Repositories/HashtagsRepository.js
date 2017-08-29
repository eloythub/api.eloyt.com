'use strict'

import debug from 'debug'
import configs from '../../Configs'
import * as Models from '../Models'

export default class HashtagsRepository {
  static async fetchIdBySlug (slug) {
    const log = debug(`${configs.debugZone}:HashtagsRepository:fetchIdBySlug`)

    log('fetchIdBySlug')

    const hashtag = await Models.Hashtags.findOne({where: {slug}})

    if (!hashtag) {
      return null
    }

    return hashtag.id
  }

  static async fetchAll () {
    const log = debug(`${configs.debugZone}:HashtagsRepository:fetchAll`)

    log('fetchAll')

    const hashtags = await Models.Hashtags.findAll()

    if (!hashtags) {
      return null
    }

    return hashtags
  }

  static async fetchAllByIds (ids) {
    const log = debug(`${configs.debugZone}:HashtagsRepository:fetchAllByIds`)

    log('fetchAllByIds')

    const hashtags = await Models.Hashtags.findAll({where: {id: ids}})

    if (!hashtags) {
      return null
    }

    return hashtags
  }
}
