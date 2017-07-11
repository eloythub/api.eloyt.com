'use strict';

import configs from '../../configs';
import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';

const {postgresDb} = configs;

let sequelize = new Sequelize(postgresDb.database, postgresDb.username, postgresDb.password, {
    host: postgresDb.host,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  });

var db = {};

fs.readdirSync(__dirname)
  .filter((file) => (file.indexOf(".") !== 0) && (file !== "index.js"))
  .forEach((file) => {
    var model = sequelize["import"](path.join(__dirname, file));

    db[model.name] = model;

  });

Object.keys(db).forEach(function (modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});
console.log('import ', db);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;