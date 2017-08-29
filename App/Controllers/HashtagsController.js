'use strict'

import debug from 'debug'
import configs from '../../Configs'
import HashtagsService from '../Services/HashtagsService'

export default class HashtagsController {
  static async getHashtags (req, res) {
    const error = debug(`${configs.debugZone}:HashtagsController:getHashtags`)

    try {
      const data = await HashtagsService.getAllHashtags()

      res({
        statusCode: 200,
        data
      }).code(200)
    } catch (e) {
      error(e.message)

      res({
        statusCode: 500,
        error: e.message
      }).code(500)
    }
  }

  static async updateUserHashtags (req, res) {
    const error = debug(`${configs.debugZone}:HashtagsController:updateUserHashtags`)

    const {user} = req.auth.credentials
    const {ids} = req.payload

    try {
      const updateResult = await HashtagsService.updateUserHashtags(user.id, ids)

      res({
        statusCode: 200,
        updateResult
      }).code(200)
    } catch (e) {
      error(e.message)

      res({
        statusCode: 500,
        error: e.message
      }).code(500)
    }
  }
};
