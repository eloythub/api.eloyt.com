'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE INDEX users_avatar_resource_id_index
        ON users (avatar_resource_id);
    `)
    await queryInterface.sequelize.query(`
      CREATE INDEX resources_user_id_index
        ON resources (user_id);
    `)
    await queryInterface.sequelize.query(`
      CREATE INDEX users_hashtags_hashtag_id_user_id_index
        ON users_hashtags (hashtag_id, user_id);
    `)
    await queryInterface.sequelize.query(`
      CREATE INDEX react_user_id_resource_id_index
        ON react (user_id, resource_id);
    `)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP INDEX react_user_id_resource_id_index;`)
    await queryInterface.sequelize.query(`DROP INDEX users_hashtags_hashtag_id_user_id_index;`)
    await queryInterface.sequelize.query(`DROP INDEX resources_user_id_index;`)
    await queryInterface.sequelize.query(`DROP INDEX users_avatar_resource_id_index;`)
  }
}
