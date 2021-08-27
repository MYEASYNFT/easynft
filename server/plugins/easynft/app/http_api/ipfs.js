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
    let res;
    try {
      res = await app.curl(`${config.easynft.ipfs.host}${config.easynft.ipfs.basePath}/${params.cid}`, {
        method: 'GET',
        timeout: config.easynft.ipfs.timeout,
      });
      ctx.helper.throwHttpError(res);
    } catch (e) {

      if (!e || e.name !== 'ResponseTimeoutError' || e.status !== -1) {
        throw e;
      }
      res = { data: null };
    }


    return res.data;

  }

}

module.exports = IpfsAPI;
