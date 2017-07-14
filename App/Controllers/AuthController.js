'use strict'

import AuthService from '../Services/AuthService'

export default class AuthController {
  static async generateToken (req, res) {
    const {userId} = req.payload

    if (!userId) {
      return res({
        statusCode: 403,
        error: 'userId is not valid'
      }).code(403)
    }

    let tokenId

    try {
      tokenId = await AuthService.generateTokenByUserId(userId)
    } catch (error) {
      return res({
        statusCode: 500,
        error
      })
    }

    return res({
      statusCode: 200,
      tokenId
    })
  }
}
