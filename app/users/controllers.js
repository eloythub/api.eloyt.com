'use strict';

module.exports = class Controllers {
  create(request, reply) {
    reply({
      status: true,
      message: 'user created'
    });
  }

  fetch(request, reply) {
    reply({
      status: true,
      message: 'fetch user info'
    });
  }
}
