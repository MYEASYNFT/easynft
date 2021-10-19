'use strict';

/**
 * egg-easynft default config
 * @member Config#easynft
 * @property {String} SOME_KEY - some description
 */
exports.easynft = {
  basePath: '/easynft',
  maxtrix_storage: {
    host: 'https://testnft-api.atpool.com',
    basePath: '/store/openapi/v1',
    storeBasePath: '/store/openapi/v1',
    bucketName: '$nft',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      From: 'openapi',
    },
    proxyHeaders: [ 'AppId', 'AppVersion', 'Signature', 'From' ].map(_ => _.toLowerCase()),
  },
  cid: {
    chunk: 1048576,
    algHashName: 'sha2-256',
    version: 0,
    codec: 'dag-pb',
    multibaseName: 'base58btc',
  },
  ipfs: {
    host: 'https://st-ipmanager.bingheyc.com',
    basePath: '/ipfs',
    timeout: 5000,
  },
};

exports.customLoader = {
  httpAPI: {
    // 相对于 app.config.baseDir
    directory: 'app/http_api',
    // 如果是 ctx 则使用 loadToContext
    inject: 'ctx',
    // 是否加载框架和插件的目录
    loadunit: true,
    // 还可以定义其他 LoaderOptions
    caseStyle: 'upper',
  },
};

exports.multipart = {
  mode: 'file',
  fileSize: '100mb',
};
