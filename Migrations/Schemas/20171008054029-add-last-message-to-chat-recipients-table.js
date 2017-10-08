'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE chat_recipients ADD last_message_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT null NULL;
    `)
    await queryInterface.sequelize.query(`
      ALTER TABLE chat_recipients ADD last_message_id UUID NULL REFERENCES messages (id);
    `)
    await queryInterface.sequelize.query(`
      CREATE INDEX chat_recipients_last_message_id_index ON chat_recipients (last_message_id);
    `)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP INDEX chat_recipients_last_message_id_index RESTRICT;`)
    await queryInterface.sequelize.query(`ALTER TABLE chat_recipients DROP last_message_id;`)
    await queryInterface.sequelize.query(`ALTER TABLE chat_recipients DROP last_message_at;`)
  }
}
