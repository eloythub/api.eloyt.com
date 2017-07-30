'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE TYPE genders AS ENUM (
        'male',
        'female',
        'other'
      );
    `)
    await queryInterface.sequelize.query(`
      CREATE TYPE resource_types AS ENUM (
        'avatar',
        'video',
        'thumbnail'
      );
    `)
    await queryInterface.sequelize.query(`
      CREATE TYPE react_types AS ENUM (
        'skip',
        'like',
        'dislike'
      );
    `)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('DROP TYPE genders;')
    await queryInterface.sequelize.query('DROP TYPE resource_types;')
    await queryInterface.sequelize.query('DROP TYPE react_types;')
  }
}
