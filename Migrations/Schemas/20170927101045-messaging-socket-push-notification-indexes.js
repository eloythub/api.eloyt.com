'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`        
      CREATE INDEX messages_sender_user_id_receiver_user_id_index 
        ON messages (sender_user_id, receiver_user_id);
    `)
    await queryInterface.sequelize.query(`        
      CREATE INDEX push_tokens_registry_user_id_index 
        ON push_tokens_registry (user_id);
    `)
    await queryInterface.sequelize.query(`        
      CREATE INDEX sockets_user_id_index 
        ON sockets (user_id);
    `)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP INDEX sockets_user_id_index;`)
    await queryInterface.sequelize.query(`DROP INDEX push_tokens_registry_user_id_index;`)
    await queryInterface.sequelize.query(`DROP INDEX messages_sender_user_id_receiver_user_id_index;`)
  }
}
