/**
 * @fileOverview nft metadata service
 * @name nft_metadata.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const fs = require('fs');
const BigNumber = require('bignumber.js');
const JSONbig = require('json-bigint');
const urlencode = require('urlencode');

const { Service } = require('egg');

const PENDING_STATUS = [ 6, 9, 8, 10 ];

class NFTMetadataService extends Service {

  async create(files, opts) {

    const { ctx, config } = this;

    const images = [];
    const fileInfos = [];
    const _files = [];
    for (const file of files) {
      const fileStream = fs.createReadStream(file.filepath);
      const fileCID = await ctx.helper.generateCID(fileStream);
      fileStream.destroy();

      fileInfos.push({ cid: fileCID, filename: file.filename });
      _files.push({ cid: fileCID, file });
      images.push(`ipfs://${fileCID}`);
    }

    const properties = opts.properties ? { ...JSON.parse(opts.properties), files: fileInfos } : { files: fileInfos };
    const metadata = {
      ...opts, image: images.join(','), properties,
    };
    if (opts.decimals) {
      metadata.decimals = BigNumber(opts.decimals);
    }
    const metadata_buffer = Buffer.from(JSONbig.stringify(metadata));
    const cid = await ctx.helper.generateCID(metadata_buffer);

    const [ metadataStat ] = await await ctx.httpAPI.MatrixStorage.file_detail({
      bucket_name: config.easynft.maxtrix_storage.bucketName,
      cid,
      file_name: 'metadata',
      page_index: 1,
      page_size: 1,
    });
    if (metadataStat) {
      return await this.getOne(metadataStat);
    }

    const promises = _files.map(_ => this.upload(_.cid, _.file));
    await Promise.all(promises);
    await this.upload(cid, metadata_buffer);
    return { cid, metadata, status: 'pending' };
  }

  async upload(cid, data) {

    const { ctx, config } = this;

    let info,
      file_name,
      file_size,
      file_content,
      file_type;
    if (Buffer.isBuffer(data)) {
      file_name = 'metadata';
      file_size = data.byteLength;
      file_content = data;
      file_type = 'application/json';
    } else {
      const info_list = await ctx.httpAPI.MatrixStorage.file_detail({
        bucket_name: config.easynft.maxtrix_storage.bucketName,
        cid,
        page_index: 1,
        page_size: 1,
      });
      info = info_list[0];
      const stat = await fs.promises.stat(data.filepath);
      file_name = urlencode(data.filename, 'utf8');
      file_size = stat.size;
      file_content = fs.createReadStream(data.filepath);
      file_type = data.mime;
    }

    if (info) {
      file_content.destroy();
      return;
    }

    const { store_host, credential, event_id } = await ctx.httpAPI.MatrixStorage.ask_for_upload_credential({
      bucket_name: config.easynft.maxtrix_storage.bucketName,
      file_name,
      is_verified: 0,
      file_size,
    });

    await ctx.httpAPI.MatrixStorage.upload_file(file_content, {
      credential,
      bucket_name: config.easynft.maxtrix_storage.bucketName,
      file_type,
      file_name,
      is_verified: 0,
      file_size,
      is_private: 0,
      event_id,
      store_host,
    });

    if (!Buffer.isBuffer(file_content)) { file_content.destroy(); }

  }

  async getOne({ cid, store_host, ...opts }) {

    if (PENDING_STATUS.includes(opts.status)) {
      return { cid, status: 'pending' };
    }

    const { ctx, config } = this;

    const metadata_buffer = await ctx.httpAPI.MatrixStorage.download_file({
      bucket_name: config.easynft.maxtrix_storage.bucketName,
      cid,
      store_host,
    });
    const metadata = JSONbig.parse(metadata_buffer.toString('utf8'));

    let status = 'complete';
    for (const file of metadata.properties.files) {
      const [ stat ] = await ctx.httpAPI.MatrixStorage.file_detail({
        bucket_name: config.easynft.maxtrix_storage.bucketName,
        cid: file.cid,
        page_index: 1,
        page_size: 1,
      });
      if (!stat || PENDING_STATUS.includes(stat.status)) {
        status = 'pending';
        break;
      }
    }

    return { cid, metadata, status };
  }

  async findOne(cid) {
    const { config, ctx } = this;

    const [ metadataStat ] = await ctx.httpAPI.MatrixStorage.file_detail({
      bucket_name: config.easynft.maxtrix_storage.bucketName,
      cid,
      file_name: 'metadata',
      page_index: 1,
      page_size: 1,
    });

    if (!metadataStat) {
      return null;
    }

    return await this.getOne(metadataStat);
  }

  async find(conditions) {

    const { config, ctx } = this;
    const stats = await ctx.httpAPI.MatrixStorage.bucket_files_list({
      page_index: 1,
      page_size: 10,
      ...conditions,
      bucket_name: config.easynft.maxtrix_storage.bucketName,
      search_name: 'metadata',
    });

    if (stats.length <= 0) {
      return stats;
    }

    const res = await Promise.all(stats.map(_ => this.getOne(_)));
    return res;
  }
}

module.exports = NFTMetadataService;
