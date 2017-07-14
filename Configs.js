'use strict';

import dotenv from 'dotenv';

let path

if (process.env.NODE_ENV === 'test') {
  path = '.env.test'
}

dotenv.config({ path, silent: true })

const {env} = process;

export default {
  nodeEnv: env['NODE_ENV'] || 'dev',
  debugZone: env['DEBUG_ZONE'] || 'ELOYT-ZONE',
  exposePort: env['EXPOSE_PORT'] || 80,
  mongoDb: {
    username: env['MONGO_DB_USERNAME'] || '',
    password: env['MONGO_DB_PASSWORD'] || '',
    host: env['MONGO_DB_HOST'] || 'mongoDB',
    port: env['MONGO_DB_PORT'] || 27017,
    database: env['MONGO_DB_DATABSE'] || 'eloyt',
  },
  postgresDb: {
    username: env['POSTGRES_DB_USERNAME'] || '',
    password: env['POSTGRES_DB_PASSWORD'] || '',
    host: env['POSTGRES_DB_HOST'] || 'postgresdb',
    port: env['POSTGRES_DB_PORT'] || 5432,
    database: env['POSTGRES_DB_DATABSE'] || 'eloyt',
  },
  googleCloudProjectId: env['GCLOUD_PROJECT_ID'],
  googleCloudStorageBucket: env['GCLOUD_STORAGE_BUCKET'] || 'eloyt',
};
