'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log()
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('DROP EXTENSION "uuid-ossp";')
  }
}
