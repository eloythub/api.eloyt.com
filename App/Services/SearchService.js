'use strict'

import debug from 'debug'
import configs from '../../Configs'
import UsersRepository from '../Repositories/UsersRepository'

export default class SearchService {
  static async searchForUsers (searchQuery) {
    const log = debug(`${configs.debugZone}:SearchService:searchForUsers`)

    log('searchForUsers')

    const resultData = await UsersRepository.fetchUsersBySearchQuery(searchQuery)

    return resultData
  }
};
