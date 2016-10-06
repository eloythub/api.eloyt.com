'use strict';

const Server = require('./server');
const server = new Server({
  exposePort: 80,
  mongoDb: {
    username: '',
    password: '',
    host: 'mongoDB',
    port: 27017,
    database: 'eloyt_idea_studio',
  }
});

server.fireUp();
