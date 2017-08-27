'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE users ADD facebook_id BIGINT NULL;
      CREATE UNIQUE INDEX users_facebook_id_uindex ON users (facebook_id);
    `)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`ALTER TABLE users DROP facebook_id;`)
  }
}
