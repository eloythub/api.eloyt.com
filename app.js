'use strict';

console.log(process.env);

const Server = require('./server');
const server = new Server({
  exposePort: process.env['EXPOSE_PORT'] | 80,
  mongoDb: {
    username: process.env['MONGO_DB_USERNAME'] | '',
    password: process.env['MONGO_DB_PASSWORD'] | '',
    host: process.env['MONGO_DB_HOST'] | 'mongoDB',
    port: process.env['MONGO_DB_PORT'] | 27017,
    database: process.env['MONGO_DB_DATABSE'] | 'eloyt_idea_studio',
  },
});

server.fireUp();
