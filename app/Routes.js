'use strict'

import AuthRoutes from './Routes/AuthRoutes'
import UsersRoutes from './Routes/UsersRoutes'
import StreamRoutes from './Routes/StreamRoutes'

export default class Routes {
  constructor (router) {
    this.router = router

    this.setRootRoutes()

    AuthRoutes.setRoutes(this.router, 'auth')
    UsersRoutes.setRoutes(this.router, 'users')
    StreamRoutes.setRoutes(this.router, 'stream')
  }

  setRootRoutes () {
    this.router.addRoute({
      method: 'GET',
      path: '/',
      handler: (request, reply) => {
        reply({
          statusCode: 200,
          message: 'service is up and running'
        })
      }
    })
  }
};
