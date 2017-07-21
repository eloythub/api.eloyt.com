'use strict'

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
    return `${facebookUserId}/picture?&access_token=${accessToken}&width=1024&redirect=false`
  }

  static requestProfilePicture (accessToken, facebookUserId) {
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
