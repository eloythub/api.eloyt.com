'use strict'

import debug from 'debug'
import configs from '../../Configs'
import UsersService from '../Services/UsersService'
import UsersRepository from '../Repositories/UsersRepository'

export default class UserController {
  constructor (env) {
    this.env = env
    this.repos = new UsersRepository(env)
  }

  static async createOrGet (req, res) {
    const error = debug(`${configs.debugZone}:UserController:createOrGet`)

    const {accessToken, facebookUserId} = req.payload

    try {
      const {data, action} = await UsersService.findOrCreateUser(accessToken, facebookUserId)

      res({
        statusCode: 200,
        data,
        action
      }).code(200)
    } catch (e) {
      error(e.message)

      res({
        statusCode: 500,
        error: e.message
      }).code(500)
    }
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
