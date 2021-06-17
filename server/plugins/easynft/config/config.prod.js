/* eslint valid-jsdoc: "off" */

/**
 * @fileOverview configuration for production
 * @name config.prod.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

module.exports = () => {

  const config = exports = {};

  config.easynft = { maxtrix_storage: { headers: {} }, ipfs: {} };

  if (process.env.EASYNFT_BASE_PATH) {
    config.easynft.basePath = process.env.EASYNFT_BASE_PATH;
  }

  if (process.env.EASYNFT_MAXTRIX_STORAGE_HOST) {
    config.easynft.maxtrix_storage.host = process.env.EASYNFT_MAXTRIX_STORAGE_HOST;
  }

  if (process.env.EASYNFT_MAXTRIX_STORAGE_BASE_PATH) {
    config.easynft.maxtrix_storage.basePath = process.env.EASYNFT_MAXTRIX_STORAGE_BASE_PATH;
  }

  if (process.env.EASYNFT_MAXTRIX_STORAGE_STORE_BASE_PATH) {
    config.easynft.maxtrix_storage.storeBasePath = process.env.EASYNFT_MAXTRIX_STORAGE_STORE_BASE_PATH;
  }

  if (process.env.EASYNFT_MAXTRIX_STORAGE_FROM) {
    config.easynft.maxtrix_storage.headers.from = process.env.EASYNFT_MAXTRIX_STORAGE_FROM;
  }

  if (process.env.EASYNFT_MAXTRIX_STORAGE_PROXY_HEADERS) {
    config.easynft.maxtrix_storage.proxyHeaders = process.env.EASYNFT_MAXTRIX_STORAGE_PROXY_HEADERS.split(',').map(_ => _.toLowerCase());
  }

  if (process.env.EASYNFT_IPFS_URL) {
    config.easynft.ipfs.url = process.env.EASYNFT_IPFS_URL;
  }

  if (process.env.EASYNFT_IPFS_CHUNKER) {
    config.easynft.ipfs.chunker = process.env.EASYNFT_IPFS_CHUNKER;
  }

  return {
    ...config,
  };

};
