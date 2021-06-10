'use strict';

/**
 * egg-easynft default config
 * @member Config#easynft
 * @property {String} SOME_KEY - some description
 */
exports.easynft = {
  easynft:{
    prefix:'/easynft',
    maxtrix_storage:{
      host:'http://teststc-api.atpool.com',
      bucket_name:'nft_bucket'
    },
    multihashes:{
      algorithm:'sha256',
      version:1,
      codec:'dap-pb',
      multibaseName:'base64'
    }
  }
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
  }
};

exports.multipart = {
  mode: 'file'
};
