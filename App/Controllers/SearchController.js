'use strict'

import debug from 'debug'
import configs from '../../Configs'
import SearchService from '../Services/SearchService'

export default class SearchController {
  static async search (req, res) {
    const error = debug(`${configs.debugZone}:SearchController:search`)

    const {query} = req.query

    try {
      const data = await SearchService.searchForUsers(query)

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
};
