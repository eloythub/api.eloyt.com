'use strict'

import AuthMiddleware from './Middlewares/AuthMiddleware'

export default class Schemas {
  static authSchemaTemplate (middleware) {
    return () => {
      return {
        authenticate: middleware
      }
    }
  }

  static authentication (server) {
    server.auth.scheme('token-schema', Schemas.authSchemaTemplate(AuthMiddleware.isTokenValid))

    server.auth.strategy('token', 'token-schema')
  }
};
