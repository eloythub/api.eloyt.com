'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE users ADD username VARCHAR(20) NULL;
      CREATE UNIQUE INDEX users_username_uindex ON users (username);
    `)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`ALTER TABLE users DROP username;`)
  }
}
