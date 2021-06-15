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
const JSONbig = require('json-bigint');

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

  const complete_status = [ 11, 0, 1, 2, 3, 5 ];
  const pending_status = [ 6, 9, 8, 10 ];

  describe('GET /easynft', () => {

    it('success', async () => {

      const appId = faker.datatype.string(16);
      const appVersion = faker.datatype.string(8);
      const signature = faker.datatype.string(64);
      const from = 'openapi';
      const file_name = 'metadata.json';

      const page = faker.datatype.number();
      const size = faker.datatype.number();

      const res = [];
      const items = [];
      for (let i = 12; i > 0; i--) {

        const file_status = i % 2 === 1 ? complete_status : pending_status;
        const cid = faker.datatype.hexaDecimal(32);
        const file = { cid, store_host: faker.internet.url(), status: file_status[faker.datatype.number(file_status.length - 1)] };
        const image = { cid: faker.datatype.hexaDecimal(32), filename: faker.system.fileName() };

        const imageFile_status = i % 3 === 1 ? complete_status : pending_status;
        const imageFile = { cid: image.cid, store_host: faker.internet.url(), status: imageFile_status[faker.datatype.number(imageFile_status.length - 1)] };

        const metadata = { name: faker.datatype.string(10), description: faker.random.words(), image: `ipfs://${image.cid}`, properties: { files: [ image ] },decimals:faker.datatype.number(10000000000000000000) };

        items.push(file);
        const entity = { cid, status: file_status === complete_status && imageFile_status === complete_status ? 'complete' : 'pending' };

        if (file_status === complete_status) {

          entity.metadata = metadata;
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

        }

        res.push(entity);
      }

      nock(config.maxtrix_storage.host, {
        'content-type': 'application/x-www-form-urlencoded',
        from,
        appid: appId,
        appversion: appVersion,
        signature,
      })
        .post('/store/openapi/v1/bucket_files_list', {
          bucket_name: config.maxtrix_storage.bucket_name,
          search_name: file_name,
          page,
          size,
        }).reply(200, { code: 0, msg: 'ok', data: { items } });

      app.mockHeaders({
        AppId: appId,
        AppVersion: appVersion,
        Signature: signature,
      });

      await app.httpRequest()
        .get(config.prefix)
        .query({ page, size })
        .expect(200, res);

    });

  });

  describe('GET /easynft/:cid', () => {

    it('complete', async () => {

      const cid = faker.datatype.hexaDecimal(32);
      const appId = faker.datatype.string(16);
      const appVersion = faker.datatype.string(8);
      const signature = faker.datatype.string(64);
      const from = 'openapi';
      const file_name = 'metadata.json';
      const file = { cid, store_host: faker.internet.url(), status: complete_status[faker.datatype.number(complete_status.length - 1)] };
      const image = { cid: faker.datatype.hexaDecimal(32), filename: faker.system.fileName() };
      const imageFile = { cid: image.cid, store_host: faker.internet.url(), status: complete_status[faker.datatype.number(complete_status.length - 1)] };

      const metadata = { name: faker.datatype.string(10), description: faker.random.words(), image: `ipfs://${image.cid}`, properties: { files: [ image ] },decimals:faker.datatype.number(10000000000000000000) };

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
        AppId: appId,
        AppVersion: appVersion,
        Signature: signature,
      });

      await app.httpRequest()
        .get(`${config.prefix}/${cid}`)
        .expect(200, { cid, metadata, status: 'complete' });
    });

    it('pending', async () => {

      const cid = faker.datatype.hexaDecimal(32);
      const appId = faker.datatype.string(16);
      const appVersion = faker.datatype.string(8);
      const signature = faker.datatype.string(64);
      const from = 'openapi';
      const file_name = 'metadata.json';
      const file = { cid, store_host: faker.internet.url(), status: complete_status[faker.datatype.number(complete_status.length - 1)] };
      const image = { cid: faker.datatype.hexaDecimal(32), filename: faker.system.fileName() };
      const imageFile = { cid: image.cid, store_host: faker.internet.url(), status: pending_status[faker.datatype.number(pending_status.length - 1)] };

      const metadata = { name: faker.datatype.string(10), description: faker.random.words(), image: `ipfs://${image.cid}`, properties: { files: [ image ] } ,decimals:faker.datatype.number(10000000000000000000) };

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
        AppId: appId,
        AppVersion: appVersion,
        Signature: signature,
      });

      await app.httpRequest()
        .get(`${config.prefix}/${cid}`)
        .expect(200, { cid, metadata, status: 'pending' });
    });

    it('pending without metadata', async () => {

      const cid = faker.datatype.hexaDecimal(32);
      const appId = faker.datatype.string(16);
      const appVersion = faker.datatype.string(8);
      const signature = faker.datatype.string(64);
      const from = 'openapi';
      const file_name = 'metadata.json';
      const file = { cid, store_host: faker.internet.url(), status: pending_status[faker.datatype.number(pending_status.length - 1)],decimals:faker.datatype.number(10000000000000000000)  };

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

      app.mockHeaders({
        AppId: appId,
        AppVersion: appVersion,
        Signature: signature,
      });

      await app.httpRequest()
        .get(`${config.prefix}/${cid}`)
        .expect(200, { cid, status: 'pending' });
    });


  });

  describe('POST /easynft', () => {

    it('success', async () => {

      const ctx = app.mockContext({});
      const fields = { name: faker.datatype.string(10), description: faker.random.words(),decimals:faker.datatype.number(10000000000000000000)  };
      const filename = faker.system.fileName()+'.jpg';
      const file_content = Buffer.from(faker.random.words());
      const file_cid = await ctx.helper.generateCID(file_content);
      const metadata = {...fields,image:`ipfs://${file_cid}`,properties:{files:[{cid:file_cid,filename}]}};
      const cid =  await ctx.helper.generateCID(Buffer.from(JSONbig.stringify(metadata)));

      const appId = faker.datatype.string(16);
      const appVersion = faker.datatype.string(8);
      const signature = faker.datatype.string(64);
      const from = 'openapi';
      const file_name = 'metadata.json';

      const metadata_credential = {store_host: faker.internet.url(),credential:faker.datatype.hexaDecimal(12),event_id:faker.datatype.hexaDecimal(14)};
      const image_credential = {store_host: faker.internet.url(),credential:faker.datatype.hexaDecimal(12),event_id:faker.datatype.hexaDecimal(14)};

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
        }).once()
        .reply(200, { code: 0, msg: 'ok', data: [  ] });

      nock(config.maxtrix_storage.host, {
        'content-type': 'application/x-www-form-urlencoded',
        from,
        appid: appId,
        appversion: appVersion,
        signature,
      })
        .post('/store/openapi/v1/file_detail', {
          bucket_name: config.maxtrix_storage.bucket_name,
          cid:file_cid,
          page_index: 1,
          page_size: 1,
        }).once()
        .reply(200, { code: 0, msg: 'ok', data: [] });

      nock(config.maxtrix_storage.host, {
        'content-type': 'application/x-www-form-urlencoded',
        from,
        appid: appId,
        appversion: appVersion,
        signature,
      })
        .post('/store/openapi/v1/ask_for_upload_credential', {
          bucket_name: config.maxtrix_storage.bucket_name,
          file_name,
          is_verified: 0,
          file_size:Buffer.from(JSONbig.stringify(metadata)).byteLength
        }).once()
        .reply(200, { code: 0, msg: 'ok', data: metadata_credential});

      nock(config.maxtrix_storage.host, {
        'content-type': 'application/x-www-form-urlencoded',
        from,
        appid: appId,
        appversion: appVersion,
        signature,
      })
        .post('/store/openapi/v1/ask_for_upload_credential', {
          bucket_name: config.maxtrix_storage.bucket_name,
          file_name:filename,
          is_verified: 0,
          file_size:file_content.byteLength
        }).once()
        .reply(200, { code: 0, msg: 'ok', data: image_credential});

      nock(metadata_credential.store_host, {
        from,
        appid: appId,
        appversion: appVersion,
        signature,
        eventid:metadata_credential.event_id,
        bucketname:config.maxtrix_storage.bucket_name,
        credential:metadata_credential.credential,
      })
        .post('/store/openapi/v1/upload_file').once()
        .reply(201, { code: 0, msg: 'ok', data:{}});

      nock(image_credential.store_host, {
        from,
        appid: appId,
        appversion: appVersion,
        signature,
        eventid: image_credential.event_id,
        bucketname: config.maxtrix_storage.bucket_name,
        credential: image_credential.credential,
      })
        .post('/store/openapi/v1/upload_file').once()
        .reply(201, { code: 0, msg: 'ok', data: {} });  
      
      
      app.mockHeaders({
        AppId: appId,
        AppVersion: appVersion,
        Signature: signature,
      });

      await app.httpRequest()
        .post(config.prefix)
        .field(fields)
        .attach('file',file_content,filename)
        .expect(201, { cid, metadata,status: 'pending' });
    });

  });

});
