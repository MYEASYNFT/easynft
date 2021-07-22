/**
 * @fileOverview IPFS api
 * @name ipfs.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { Service: API } = require('egg');

class IpfsAPI extends API {

  async get(params) {

    const { ctx, app, config } = this;
    const res = await app.curl(`${config.easynft.ipfs.host}${config.easynft.ipfs.basePath}/${params.cid}`, {
      method: 'GET',
      timeout: 60000,
    });
    ctx.helper.throwHttpError(res);

    return res.data;

  }

}

module.exports = IpfsAPI;
