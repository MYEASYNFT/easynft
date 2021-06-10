/**
 * @fileOverview http handler
 * @name http_handler.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';


async function index(ctx) {

  const res = await ctx.service.nftMetadata.find(ctx.query);
  ctx.body = res;

}

async function get(ctx) {

  const res = await ctx.service.nftMetadata.findOne(ctx.params.cid);
  if (!res) { return; }
  ctx.body = res;

}

async function post(ctx) {

  let res,
    error;
  try {
    res = await ctx.service.nftMetadata.create(ctx.request.files, ctx.request.body);
  } catch (e) {
    error = e;
  }
  ctx.cleanupRequestFiles();

  if (error) {
    throw error;
  }

  if (!res) { return; }

  ctx.body = res;
  ctx.status = 201;

}


exports.index = index;
exports.get = get;
exports.post = post;
