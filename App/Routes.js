'use strict'

import HealthCheckRoutes from './Routes/HealthCheckRoutes'
import AuthRoutes from './Routes/AuthRoutes'
import UsersRoutes from './Routes/UsersRoutes'
import StreamRoutes from './Routes/StreamRoutes'

export default class Routes {
  constructor (router) {
    this.router = router

    HealthCheckRoutes.setRoutes(this.router, 'health-check')
    AuthRoutes.setRoutes(this.router)
    UsersRoutes.setRoutes(this.router)
    StreamRoutes.setRoutes(this.router)
  }
};
