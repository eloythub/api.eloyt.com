'use strict'

import debug from 'debug'
import configs from '../../Configs'
import graph from 'fbgraph'

const graphVersion = '2.9'
const options = {
  timeout: 3000,
  pool: {maxSockets: Infinity},
  headers: {connection: 'keep-alive'}
}

graph.setVersion(graphVersion).setOptions(options)

export default class FacebookService {
  static requestProfileUrl (accessToken, facebookUserId) {
    const log = debug(`${configs.debugZone}:FacebookService:requestProfileUrl`)

    log('requestProfileUrl')

    const fields = [
      'id',
      'email',
      'name',
      'gender',
      'first_name',
      'last_name',
      'about',
      'birthday'
    ]

    return `${facebookUserId}?fields=${fields.join(',')}&access_token=${accessToken}`
  }

  static requestProfile (accessToken, facebookUserId) {
    const log = debug(`${configs.debugZone}:FacebookService:requestProfile`)

    log('requestProfile')

    return new Promise((resolve, reject) => {
      graph.get(FacebookService.requestProfileUrl(accessToken, facebookUserId), (error, res) => {
        if (error) {
          reject(error)

          return
        }

        resolve(res)
      })
    })
  }

  static requestProfilePictureUrl (accessToken, facebookUserId) {
    const log = debug(`${configs.debugZone}:FacebookService:requestProfilePictureUrl`)

    log('requestProfilePictureUrl')

    return `${facebookUserId}/picture?&access_token=${accessToken}&width=1024&redirect=false`
  }

  static requestProfilePicture (accessToken, facebookUserId) {
    const log = debug(`${configs.debugZone}:FacebookService:requestProfilePicture`)

    log('requestProfilePicture')

    return new Promise((resolve, reject) => {
      graph.get(FacebookService.requestProfilePictureUrl(accessToken, facebookUserId), (error, res) => {
        if (error) {
          reject(error)

          return
        }

        resolve(res)
      })
    })
  }
};
