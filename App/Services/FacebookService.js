'use strict'

import graph from 'fbgraph'

const graphVersion = '2.9'
const options = {
  timeout: 3000,
  pool: {maxSockets: Infinity},
  headers: {connection: 'keep-alive'}
}

export default class FacebookService {
  static requestProfile (accessToken, facebookUserId) {
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

    const api = `${facebookUserId}?fields=${fields.join(',')}&access_token=${accessToken}`

    return new Promise((resolve, reject) => {
      graph.setVersion(graphVersion)

      graph.setOptions(options).get(api, (error, res) => {
        if (error) {
          reject(error)

          return
        }

        resolve(res)
      })
    })
  }

  static requestProfilePicture (accessToken, facebookUserId) {
    const api = `${facebookUserId}/picture?&access_token=${accessToken}&width=1024&redirect=false`

    return new Promise((resolve, reject) => {
      graph.setVersion(graphVersion)

      graph.setOptions(options).get(api, (error, res) => {
        if (error) {
          reject(error)

          return
        }

        resolve(res)
      })
    })
  }
};
