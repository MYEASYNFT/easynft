'use strict';

/**
 * egg-easynft default config
 * @member Config#easynft
 * @property {String} SOME_KEY - some description
 */
exports.easynft = {
  basePath: '/easynft',
  maxtrix_storage: {
    host: 'http://teststc-api.atpool.com',
    basePath: '/store/openapi',
    bucketName: '$nft',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      From: 'openapi',
    },
    proxyHeaders: [ 'AppId', 'AppVersion', 'Signature' ].map(_=>_.toLowerCase()),
  },
  multihashes: {
    algorithm: 'sha256',
    hashName: 'sha2-256',
    version: 1,
    codec: 'dag-pb',
    multibaseName: 'base64',
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
};
