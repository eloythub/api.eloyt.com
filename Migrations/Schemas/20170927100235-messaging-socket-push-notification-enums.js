'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE TYPE message_types AS ENUM (
        'text',
        'image',
        'video'
      );
    `)
    await queryInterface.sequelize.query(`
      CREATE TYPE device_types AS ENUM (
        'apple',
        'android',
        'windows',
        'web'
      );
    `)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('DROP TYPE message_types;')
    await queryInterface.sequelize.query('DROP TYPE device_types;')
  }
}
