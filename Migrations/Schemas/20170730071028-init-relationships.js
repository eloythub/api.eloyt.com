'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE users
        ADD CONSTRAINT users_resources_id_fk FOREIGN KEY (avatar_resource_id) REFERENCES resources (id);
    `)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`ALTER TABLE users DROP CONSTRAINT users_resources_id_fk;`)
  }
}
