/**
 * @fileOverview test code
 * @name easynft.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const mock = require('egg-mock');
const nock = require('nock');
const faker = require('faker');

describe('egg-plugin:easynft.test.js', () => {

  let app,
    config;
  before(async () => {
    app = mock.app({
      baseDir: 'apps/easynft-test',
    });
    await app.ready();
    config = app.config.easynft;
  });

  after(() => app.close());
  afterEach(mock.restore);

  describe('GET /easynft', () => {

    it('success', async () => {

    });

  });

  describe('GET /easynft/:cid', () => {

    it('success', async () => {

      const cid = faker.datatype.hexaDecimal(32);
      const appId = faker.datatype.string(16);
      const appVersion = faker.datatype.string(8);
      const signature = faker.datatype.string(64);
      const from = 'openapi';
      const file_name = 'metadata.json';
      const success_status = [ 11, 0, 1, 2, 3, 5 ];
      const file = { cid, store_host: faker.internet.url(), status: success_status[faker.datatype.number(success_status.length - 1)] };
      const image = { cid: faker.datatype.hexaDecimal(32), filename: faker.system.fileName() };
      const imageFile = { cid: image.cid, store_host: faker.internet.url(), status: success_status[faker.datatype.number(success_status.length - 1)] };

      const metadata = { name: faker.datatype.string(10), description: faker.random.words(), image: `ipfs://${image.cid}`, properties: {files:[ image ]} };

      nock(config.maxtrix_storage.host, {
        'content-type': 'application/x-www-form-urlencoded',
        from,
        appid: appId,
        appversion: appVersion,
        signature,
      })
        .post('/store/openapi/v1/file_detail', {
          bucket_name: config.maxtrix_storage.bucket_name,
          cid,
          file_name,
          page_index: 1,
          page_size: 1,
        }).reply(200, { code: 0, msg: 'ok', data: [ file ] });


      nock(file.store_host, {
        from,
        appid: appId,
        appversion: appVersion,
        signature,
      })
        .get('/store/openapi/v1/download_file')
        .query({
          bucket_name: config.maxtrix_storage.bucket_name,
          cid,
        })
        .reply(200, Buffer.from(JSON.stringify(metadata)), { 'Content-Disposition': `attachment; filename="${image.filename}"` });

      nock(config.maxtrix_storage.host, {
        'content-type': 'application/x-www-form-urlencoded',
        from,
        appid: appId,
        appversion: appVersion,
        signature,
      })
        .post('/store/openapi/v1/file_detail', {
          bucket_name: config.maxtrix_storage.bucket_name,
          cid: image.cid,
          page_index: 1,
          page_size: 1,
        }).reply(200, { code: 0, msg: 'ok', data: [ imageFile ] });

      app.mockHeaders({
        AppId:appId,
        AppVersion:appVersion,
        Signature:signature,        
      });

      await app.httpRequest()
        // .set('AppId', appId)
        // .set('AppVersion', appVersion)
        // .set('Signature', signature)
        .get(`${config.prefix}/${cid}`)
        .expect(200, { cid, metadata, status: 'complete' });
    });

  });

  describe('POST /easynft', () => {

    it('success', async () => {

    });

  });

});
