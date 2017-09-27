'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE TABLE messages (
        id               UUID PRIMARY KEY                        DEFAULT uuid_generate_v4(),
        sender_user_id   UUID                           NOT NULL REFERENCES users (id),
        receiver_user_id UUID                           NOT NULL REFERENCES users (id),
        type             message_types                  NOT NULL,
        message          TEXT                           NOT NULL CHECK (trim(message) <> ''),
        sent_at          TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT now(),
        seen_at          TIMESTAMP(0) WITHOUT TIME ZONE
      );
    `)
    await queryInterface.sequelize.query(`
      CREATE TABLE push_tokens_registry (
        id            UUID PRIMARY KEY                        DEFAULT uuid_generate_v4(),
        user_id       UUID                           NOT NULL REFERENCES users (id),
        device_type   device_types                   NOT NULL,
        token         TEXT                           NOT NULL CHECK (trim(token) <> ''),
        registered_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT now()
      );
    `)
    await queryInterface.sequelize.query(`
      CREATE UNLOGGED TABLE sockets (
        id            UUID PRIMARY KEY                        DEFAULT uuid_generate_v4(),
        socket_id     TEXT                           NOT NULL CHECK (trim(socket_id) <> ''),
        user_id       UUID                                    REFERENCES users (id),
        view_point    TEXT,
        registered_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT now()
      );
    `)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE sockets;`)
    await queryInterface.sequelize.query(`DROP TABLE push_tokens_registry;`)
    await queryInterface.sequelize.query(`DROP TABLE messages;`)
  }
}
