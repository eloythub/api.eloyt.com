'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE EXTENSION IF NOT EXISTS postgis;
      CREATE EXTENSION IF NOT EXISTS postgis_topology;
      CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
      CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;

      CREATE TABLE users_locations (
        id            UUID PRIMARY KEY                        DEFAULT uuid_generate_v4(),
        user_id       UUID        NOT NULL REFERENCES users (id),
        coordination  POINT       NOT NULL,
        registered_at TIMESTAMPTZ NOT NULL                    DEFAULT now()
      );

      CREATE UNIQUE INDEX users_locations_user_id_uindex ON users_locations (user_id);
      
      CREATE TABLE users_locations_history (
        id            UUID PRIMARY KEY                        DEFAULT uuid_generate_v4(),
        user_id       UUID        NOT NULL REFERENCES users (id),
        coordination  POINT       NOT NULL,
        registered_at TIMESTAMPTZ NOT NULL                    DEFAULT now()
      );

      CREATE INDEX users_locations_history_user_id_index ON users_locations_history (user_id);
    `)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DROP INDEX users_locations_history_user_id_index;
      DROP TABLE users_locations_history;
      
      DROP INDEX users_locations_user_id_uindex;
      DROP TABLE users_locations;
    
      DROP EXTENSION IF EXISTS postgis_tiger_geocoder;
      DROP EXTENSION IF EXISTS fuzzystrmatch;
      DROP EXTENSION IF EXISTS postgis_topology;
      DROP EXTENSION IF EXISTS postgis;
    `)
  }
}
