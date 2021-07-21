/**
 * @fileOverview helper
 * @name helper.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { Readable } = require('stream');
const createError = require('http-errors');
const { CID_GENERATOR } = require('../../constants');

async function generateCID(data) {

  /**  @type import('ipfs-cid').ComposeGenerator **/
  const generator = this.app[CID_GENERATOR];
  if (Buffer.isBuffer(data)) {
    return await generator.generate([ new Uint8Array(data) ]);
  }
  if (data instanceof Readable) {
    return await generator.generate(data);
  }
  throw new Error('UNSUPPORT_DATA');

}

function generateMatrixStorageAPIHeaders(headers = {}) {
  const { ctx, config } = this;

  const default_headers = config.easynft.maxtrix_storage.headers || {};
  const proxy_header_keys = config.easynft.maxtrix_storage.proxyHeaders || [];
  const proxy_headers = {};

  for (const key of proxy_header_keys) {
    if (ctx.headers[key] !== undefined) {
      proxy_headers[key] = ctx.headers[key];
    }
  }

  return {
    ...default_headers,
    ...proxy_headers,
    ...headers,
  };
}

function throwMatrixStorageAPIError(resp) {
  if (resp.code === 0) {
    return;
  }

  let error;
  if (resp.code >= 400 && resp.code < 600) {
    error = createError(resp.code, resp.msg);
  } else {
    error = createError(409, resp.msg);
  }
  error.type = error.biz_code = resp.code;
  throw error;
}

function throwHttpError(res) {
  if (res.status >= 400 && res.status < 600) {
    const error = createError(res.status, res.data);
    error.type = res.status;
    throw error;
  }
}

exports.generateCID = generateCID;
exports.generateMatrixStorageAPIHeaders = generateMatrixStorageAPIHeaders;
exports.throwMatrixStorageAPIError = throwMatrixStorageAPIError;
exports.throwHttpError = throwHttpError;
