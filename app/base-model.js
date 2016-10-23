'use strict';

const mongoose = require('mongoose');

module.exports = class BaseModel {
  constructor(env) {
    this.env = env;

    const credential = env.mongoDb.username
      ? `${env.mongoDb.username}:${env.mongoDb.password}@`
      : '';

    const connectionString = `mongodb://${credential}${env.mongoDb.host}` +
      `:${env.mongoDb.port}/${env.mongoDb.database}`;

    mongoose.Promise = global.Promise;

    this.mongoose = env.mongoose = env.mongoose || mongoose.connect(
      connectionString
    );

    env.mongooseSchemas  = {};
    this.mongooseSchemas = env.mongooseSchemas;
  }

  registerSchema(alias, collectionName, schema) {
    const Schema = this.mongoose.Schema;

    return this.mongooseSchemas[alias] = this.mongooseSchemas[alias]
      || this.mongoose.model(
        collectionName, new Schema(schema)
      );
  }
}
