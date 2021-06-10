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

    const {app} = this;
    const config = app.config.easynft;
    const router = this.app.router;

    router.get(`${config.prefix}`,httpHandler.index);
    router.get(`${config.prefix}/:cid`,httpHandler.get);
    router.post(`${config.prefix}`,httpHandler.post);
  }
}

module.exports = AppBootHook;
