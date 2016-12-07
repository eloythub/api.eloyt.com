'use strict';

const BaseRoute = require('../base-router');

module.exports = class StreamRoutes extends BaseRoute {
  constructor(router, env, routerBaseUrl) {
    super(router, env, routerBaseUrl);

    this.router = router;

    this.setRoutes();
  }

  setRoutes() {
    this.router.addRoute({
      method: 'POST',
      path: this.prefix + '/upload/video',
      config: {
        payload: {
          timeout: 30034,
          allow: 'multipart/form-data',
          maxBytes: 2097152000, // almost 2GB
          output: 'stream',
          parse: true,
        },
        handler: this.controllers.videoUploadHandle,
      },
    });
  }
}
