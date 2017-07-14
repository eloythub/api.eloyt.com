'use strict'

import UsersRoutes from './routes/usersRoutes'
import StreamRoutes from './routes/streamRoutes'

export default class Routes {
  constructor (router) {
    this.router = router

    this.setRootRoutes()

    UsersRoutes.setRoutes(this.router, 'users')
    StreamRoutes.setRoutes(this.router, 'stream')
  }

  setRootRoutes () {
    this.router.addRoute({
      method: 'GET',
      path: '/',
      handler: (request, reply) => {
        reply({
          status: true,
          message: 'service is up and running'
        })
      }
    })
  }
};
