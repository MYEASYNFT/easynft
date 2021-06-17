/**
 * @fileOverview http handler
 * @name http_handler.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const JSONbig = require('json-bigint');

async function index(ctx) {

  const res = await ctx.service.nftMetadata.find(ctx.query);

  ctx.set('Content-Type', 'application/json');
  ctx.body = JSONbig.stringify(res);

}

async function get(ctx) {

  const res = await ctx.service.nftMetadata.findOne(ctx.params.cid);
  if (!res) { return; }

  ctx.set('Content-Type', 'application/json');
  ctx.body = JSONbig.stringify(res);

}

async function post(ctx) {
  let res,
    error;
  try {
    if (ctx.request.files.length <= 0) { ctx.helper.throwHttpError({ status: 400, data: 'required file' }); }
    res = await ctx.service.nftMetadata.create(ctx.request.files, ctx.request.body);
  } catch (e) {
    error = e;
  }
  ctx.cleanupRequestFiles();

  if (error) {
    throw error;
  }

  if (!res) { return; }

  ctx.set('Content-Type', 'application/json');
  ctx.body = JSONbig.stringify(res);
  ctx.status = 201;

}


exports.index = index;
exports.get = get;
exports.post = post;
