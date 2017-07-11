'use strict';

import UserController from './controllers';

const Joi = require('joi');

export default class UsersRoutes {
  constructor(router, prefix) {
    this.prefix = `/${prefix}`;
    this.router = router;

    this.setRoutes();
  }

  setRoutes() {
    this.router.addRoute({
      method: 'PUT',
      path: this.prefix + '/create-or-get',
      handler: (req, res) => UserController.createOrGet(req, res),
    });

    this.router.addRoute({
      method: 'POST',
      path: this.prefix + '/profile-update',
      handler: (req, res) => UserController.profileUpdate(req, res),
    });

    this.router.addRoute({
      method: 'GET',
      path: this.prefix + '/{userId}',
      config: {
        handler: (req, res) => UserController.getProfile(req, res),
        validate: {
          params: {
            userId: Joi.string(),
          }
        }
      },
    });
  }
};
