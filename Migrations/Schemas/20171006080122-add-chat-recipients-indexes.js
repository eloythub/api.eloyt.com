'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`        
      CREATE INDEX chat_recipients_host_user_id_guest_user_id_index 
        ON chat_recipients (host_user_id, guest_user_id);
    `)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP INDEX chat_recipients_host_user_id_guest_user_id_index;`)
  }
}
