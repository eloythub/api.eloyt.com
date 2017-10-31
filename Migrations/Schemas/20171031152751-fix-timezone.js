'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      SET TIME ZONE 'UTC';

      ALTER TABLE auth_tokens ALTER COLUMN created_at TYPE TIMESTAMP(0) WITH TIME ZONE USING created_at::TIMESTAMP(0) WITH TIME ZONE;

      ALTER TABLE chat_recipients ALTER COLUMN sent_at TYPE TIMESTAMPTZ USING sent_at::TIMESTAMPTZ;
      ALTER TABLE chat_recipients ALTER COLUMN last_message_at TYPE TIMESTAMPTZ USING last_message_at::TIMESTAMPTZ;
      ALTER TABLE chat_recipients ALTER COLUMN last_message_at SET DEFAULT NULL;
      
            
      ALTER TABLE messages ALTER COLUMN sent_at TYPE TIMESTAMPTZ USING sent_at::TIMESTAMPTZ;
      ALTER TABLE messages ALTER COLUMN seen_at TYPE TIMESTAMPTZ USING seen_at::TIMESTAMPTZ;
      
      ALTER TABLE push_tokens_registry ALTER COLUMN registered_at TYPE TIMESTAMPTZ USING registered_at::TIMESTAMPTZ;
      
      ALTER TABLE react ALTER COLUMN reacted_at TYPE TIMESTAMPTZ USING reacted_at::TIMESTAMPTZ;
      
      ALTER TABLE resources ALTER COLUMN uploaded_at TYPE TIMESTAMPTZ USING uploaded_at::TIMESTAMPTZ;
      
      ALTER TABLE sockets ALTER COLUMN registered_at TYPE TIMESTAMPTZ USING registered_at::TIMESTAMPTZ;
      
      ALTER TABLE users ALTER COLUMN registered_at TYPE TIMESTAMPTZ USING registered_at::TIMESTAMPTZ;
      ALTER TABLE users ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at::TIMESTAMPTZ;
      
      ALTER TABLE videos_thumbnails ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at::TIMESTAMPTZ;
    `)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE auth_tokens ALTER COLUMN created_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE USING created_at::TIMESTAMP(0) WITHOUT TIME ZONE;
      
      ALTER TABLE chat_recipients ALTER COLUMN sent_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE USING sent_at::TIMESTAMP(0) WITHOUT TIME ZONE;
      ALTER TABLE chat_recipients ALTER COLUMN last_message_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE USING last_message_at::TIMESTAMP(0) WITHOUT TIME ZONE;
      
      ALTER TABLE messages ALTER COLUMN sent_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE USING sent_at::TIMESTAMP(0) WITHOUT TIME ZONE;
      ALTER TABLE messages ALTER COLUMN seen_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE USING seen_at::TIMESTAMP(0) WITHOUT TIME ZONE;
      
      ALTER TABLE push_tokens_registry ALTER COLUMN registered_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE USING registered_at::TIMESTAMP(0) WITHOUT TIME ZONE;
      
      ALTER TABLE react ALTER COLUMN reacted_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE USING reacted_at::TIMESTAMP(0) WITHOUT TIME ZONE;
      
      ALTER TABLE resources ALTER COLUMN uploaded_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE USING uploaded_at::TIMESTAMP(0) WITHOUT TIME ZONE;
      
      ALTER TABLE sockets ALTER COLUMN registered_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE USING registered_at::TIMESTAMP(0) WITHOUT TIME ZONE;
      
      ALTER TABLE users ALTER COLUMN registered_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE USING registered_at::TIMESTAMP(0) WITHOUT TIME ZONE;
      ALTER TABLE users ALTER COLUMN updated_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE USING updated_at::TIMESTAMP(0) WITHOUT TIME ZONE;
      
      ALTER TABLE videos_thumbnails ALTER COLUMN created_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE USING created_at::TIMESTAMP(0) WITHOUT TIME ZONE;
    `)
  }
}
