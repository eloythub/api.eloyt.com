'use strict';

const mongoose = require('mongoose');


module.exports = class UsersModel {
  constructor(env) {
    this.env = env;

    const credential = env.mongoDb.username ? `${env.mongoDb.username}:${env.mongoDb.password}@` : '';

    const connectionString = `mongodb://${credential}${env.mongoDb.host}:${env.mongoDb.port}/${env.mongoDb.database}`;

    this.mongoose = mongoose.connect(connectionString);
  }
}
