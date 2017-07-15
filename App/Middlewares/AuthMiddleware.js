'use strict'

import UsersService from '../Services/UsersService'

export default class AuthMiddleware {
  static async isTokenValid (req, reply) {
    if (!req.headers.hasOwnProperty('authorization')) {
      return reply({
        statusCode: 401,
        message: 'authorization failed'
      }).code(401)
    }

    const { authorization } = req.headers

    if (!authorization) {
      return reply({
        statusCode: 401,
        message: 'token is not valid'
      }).code(401)
    }

    const [type, tokenId] = authorization.split(' ')

    if (['basic', 'bearer'].indexOf(type) < 0) {
      return reply({
        statusCode: 401,
        message: 'authentication type must be "basic" or "bearer"'
      }).code(401)
    }

    if (!tokenId) {
      return reply({
        statusCode: 401,
        message: 'token id is not valid'
      }).code(401)
    }

    const user = await UsersService.getUserByTokenId(tokenId)

    return reply.continue({
      isAuthenticated: true,
      credentials: {
        type,
        tokenId,
        user
      }
    })
  }
};
