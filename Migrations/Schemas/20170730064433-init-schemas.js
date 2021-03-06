'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE TABLE users (
        id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email              TEXT                           NOT NULL UNIQUE CHECK (trim(email) <> ''),
        name               TEXT CHECK (trim(name) <> ''),
        mobile             TEXT CHECK (trim(mobile) <> ''),
        first_name         TEXT CHECK (trim(first_name) <> ''),
        last_name          TEXT CHECK (trim(last_name) <> ''),
        date_of_birth      DATE,
        gender             genders,
        avatar_resource_id UUID,
        about_me           TEXT,
        is_activated       BOOLEAN                        NOT NULL DEFAULT FALSE,
        registered_at      TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT now(),
        updated_at         TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT now()
      );
    `)
    await queryInterface.sequelize.query(`
      CREATE TABLE resources (
        id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        type              resource_types NOT NULL,
        user_id           UUID                           NOT NULL REFERENCES users (id),
        cloud_url         TEXT                           NOT NULL CHECK (trim(cloud_url) <> ''),
        cloud_filename    TEXT                           NOT NULL CHECK (trim(cloud_filename) <> ''),
        uploaded_at       TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT now()
      );
    `)
    await queryInterface.sequelize.query(`
      CREATE TABLE videos_thumbnails (
        id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        video_resource_id     UUID                           NOT NULL REFERENCES resources (id),
        thumbnail_resource_id UUID                           NOT NULL REFERENCES resources (id),
        image_size            NUMERIC                        NULL DEFAULT 0,
        created_at            TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT now()
      );
    `)
    await queryInterface.sequelize.query(`
      CREATE TABLE hashtags (
        id   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        slug TEXT NOT NULL UNIQUE CHECK (trim(slug) <> ''),
        name TEXT NOT NULL CHECK (trim(name) <> '')
      );
    `)
    await queryInterface.sequelize.query(`
      CREATE TABLE users_hashtags (
        id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        hashtag_id UUID NOT NULL  REFERENCES hashtags (id),
        user_id    UUID NOT NULL  REFERENCES users (id)
      );
    `)
    await queryInterface.sequelize.query(`
      CREATE TABLE react (
        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        type        react_types NOT NULL,
        user_id     UUID                           NOT NULL REFERENCES users (id),
        resource_id UUID                           NOT NULL REFERENCES resources (id),
        reacted_at  TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT now()
      );
    `)
    await queryInterface.sequelize.query(`
      CREATE TABLE auth_tokens (
        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id     UUID                           NOT NULL REFERENCES users (id),
        created_at  TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT now()
      );
    `)
    await queryInterface.sequelize.query(`
      CREATE TABLE videos_properties (
        id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        video_resource_id UUID NOT NULL REFERENCES resources (id),
        description       TEXT NOT NULL CHECK (trim(description) <> '')
      );
    `)
    await queryInterface.sequelize.query(`
      CREATE TABLE videos_hashtags (
        id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        hashtag_id        UUID NOT NULL  REFERENCES hashtags (id),
        video_resource_id UUID NOT NULL REFERENCES resources (id)
      );
    `)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE videos_hashtags;`)
    await queryInterface.sequelize.query(`DROP TABLE videos_properties;`)
    await queryInterface.sequelize.query(`DROP TABLE auth_tokens;`)
    await queryInterface.sequelize.query(`DROP TABLE react;`)
    await queryInterface.sequelize.query(`DROP TABLE users_hashtags;`)
    await queryInterface.sequelize.query(`DROP TABLE hashtags;`)
    await queryInterface.sequelize.query(`DROP TABLE videos_thumbnails;`)
    await queryInterface.sequelize.query(`DROP TABLE resources;`)
    await queryInterface.sequelize.query(`DROP TABLE users;`)
  }
}
