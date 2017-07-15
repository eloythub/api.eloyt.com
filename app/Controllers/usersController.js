'use strict'

import UsersRepository from '../Repositories/UsersRepository'

export default class UserController {
  constructor (env) {
    this.env = env
    this.repos = new UsersRepository(env)
  }

  static createOrGet (req, res) {
    const {token} = req.payload

    res({
      statusCode: 200,
      data: {token}
    }).code(200)

    // this.repos.fetchOrCreateUser(
    //  token,
    //  user.id
    // ).then((data) => {
    //
    // }, (error) => {
    //  res({
    //    statusCode: 500,
    //    error
    //  }).code(500)
    // })
  }

  static profileUpdate (req, res) {
    if (!req.payload.credentials.userId) {
      return res({
        statusCode: 403,
        error: 'userId is not valid'
      }).code(403)
    }

    this.repos.updateUserProfile(
      req.payload.credentials.userId,
      req.payload.credentials.attributes
    ).then((data) => {
      return res({
        statusCode: 200,
        data: data
      })
    }, (error) => {
      return res({
        statusCode: 500,
        error
      }).code(500)
    })
  }

  static getProfile (req, res) {
    if (!req.params.userId) {
      return res({
        statusCode: 403,
        error: 'userId is not valid'
      }).code(403)
    }

    this.repos.getUserProfileById(req.params.userId)
      .then((data) => {
        return res({
          statusCode: 200,
          data: data
        })
      }, (error) => {
        return res({
          statusCode: 500,
          error
        }).code(500)
      })
  }
};
