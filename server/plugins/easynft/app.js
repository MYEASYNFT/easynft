/**
 * @fileOverview worker entry
 * @name app.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const httpHandler = require('./lib/http_handler');

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  async didLoad() {
    const { app } = this;
    const config = app.config.easynft;
    const router = this.app.router;

    router.get(`${config.basePath}`, httpHandler.index);
    router.get(`${config.basePath}/:cid`, httpHandler.get);
    router.post(`${config.basePath}`, httpHandler.post);
  }
}

module.exports = AppBootHook;
