# egg-easynft

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-easynft.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-easynft
[travis-image]: https://img.shields.io/travis/eggjs/egg-easynft.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-easynft
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-easynft.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-easynft?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-easynft.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-easynft
[snyk-image]: https://snyk.io/test/npm/egg-easynft/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-easynft
[download-image]: https://img.shields.io/npm/dm/egg-easynft.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-easynft

<!--
Description here.
-->

## Install

```bash
$ npm i egg-easynft --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.easynft = {
  enable: true,
  package: 'egg-easynft',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.easynft = {
    basePath: '/easynft',
    maxtrix_storage: {
        host: 'http://teststc-api.atpool.com',
        basePath: '/store/openapi/v1',
        storeBasePath: '/store/openapi/v1',
        bucketName: '$nft',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            From: 'openapi',
        },
        proxyHeaders: [ 'AppId', 'AppVersion', 'Signature' ].map(_ => _.toLowerCase()),
    },
    ipfs: {
        url: 'http://st-ipfsmanager.bingheyc.com',
        pin: true,
        chunker: 'size-1048576',
    }
};
```

see [config/config.default.js](config/config.default.js) for more detail.

### API Docs ###

see [EasyNFT](API.md) for more detail.

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
