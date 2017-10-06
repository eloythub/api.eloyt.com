'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE TABLE chat_recipients (
        id               UUID PRIMARY KEY                        DEFAULT uuid_generate_v4(),
        host_user_id     UUID                           NOT NULL REFERENCES users (id),
        guest_user_id    UUID                           NOT NULL REFERENCES users (id),
        sent_at          TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT now()
      );
    `)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE chat_recipients;`)
  }
}
