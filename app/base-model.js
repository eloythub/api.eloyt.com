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


    this.mongoose = this.env.mongoose;

    if (typeof this.env.mongoose === 'undefined') {
      this.mongoose = this.env.mongoose = mongoose.connect(connectionString);
    }

    this.mongooseSchemas = this.env.mongooseSchemas = this.env.mongooseSchemas || {};
  }

  registerSchema(alias, collectionName, schema) {
    const Schema = this.mongoose.Schema;

    return this.env.mongooseSchemas[alias] = this.env.mongooseSchemas[alias]
      || this.mongoose.model(collectionName, new Schema(schema));
  }
}
