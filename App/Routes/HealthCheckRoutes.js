'use strict'

import * as Model from '../Models'

export default class HealthCheckRoutes {
  static setRoutes (router, prefix) {
    router.addRoute({
      method: 'GET',
      path: `/${prefix}/app`,
      handler: (request, reply) => {
        reply({
          statusCode: 200,
          message: 'app is up and running'
        })
      }
    })

    router.addRoute({
      method: 'GET',
      path: `/${prefix}/database`,
      handler: async (request, reply) => {
        try {
          const queryResponse = await Model.sequelize.query('SELECT 1 AS status;', {type: Model.sequelize.QueryTypes.SELECT})

          if (queryResponse[0].status !== 1) {
            return reply({
              statusCode: 500,
              error: 'query result is wrong'
            }).code(500)
          }

          reply({
            statusCode: 200,
            message: 'database connection is stable'
          })
        } catch (error) {
          reply({
            statusCode: 500,
            error: error.message
          }).code(500)
        }
      }
    })
  }
};
