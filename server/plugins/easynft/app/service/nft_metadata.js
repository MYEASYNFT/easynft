/**
 * @fileOverview nft metadata service
 * @name nft_metadata.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const fs = require('fs');

const {Service} = require('egg');

const PENDING_STATUS = [6,9,8,10];

class NFTMetadataService extends Service{
  
  async create(files,opts){

    const {ctx,config} = this;
    
    let images = [];
    const fileInfos = [];
    const _files = [];
    for(let file of files) {
      const fileStream = fs.createReadStream(file.filepath);
      const fileCID = await ctx.helper.generateCID(fileStream);
      fileStream.destroy();
      
      fileInfos.push({cid:fileCID,filename:file.filename});
      _files.push({cid,file});
      images.push(`ipfs://{fileCID}`);
    }

    const properties = opts.properties?{...opts.properties,files:fileInfos}:{files:fileInfos};
    const metadata = {
      ...opts,image:images.join(','),properties
    };
    const metadata_buffer = Buffer.from(JSON.stringify(metadata));
    const cid = await ctx.helper.generateCID(metadata_buffer);
    const [metadataStat] = await await ctx.httpAPI.MatrixStorage.file_detail({
      bucket_name:config.easynft.maxtrix_storage.bucket_name,
      cid,
      page_index:1,
      page_size:1
    });
    if (metadataStat) {
      return {cid,metadata};
    }

    const promises = _files.map(_=>this.upload(_.cid,_.file));
    promises.push(this.upload(cid,metadata_buffer));
    await Promise.all(promises);
    
    return {cid,metadata};
  }
  
  async upload(cid,data){

    const {ctx,config} = this;

    const condition = {
      bucket_name:config.easynft.maxtrix_storage.bucket_name,
      cid,
      page_index:1,
      page_size:1
    };

    let info,file_name,file_size,file_content,file_type;
    if (Buffer.isBuffer(data)) {
      file_name = 'metadata.json';
      file_size = data.byteLength;
      file_content = data;
      file_type = 'application/json';
    }else{
      const info_list = await ctx.httpAPI.MatrixStorage.file_detail(condition);
      info = info_list[0];
      const stat = await fs.promises.stat(data.filepath);
      file_name = data.file_name;
      file_size = stat.size;
      file_content = fs.createReadStream(data.filepath);
      file_type = data.mime;
    }
    
    if (info) {
      return info;
    }

    const {store_host,credential,event_id} =  await ctx.httpAPI.MatrixStorage.ask_for_upload_credential({
      bucket_name:config.easynft.maxtrix_storage.bucket_name,
      file_name:file_name,
      is_verified:0,
      file_size:file_size
    });

    await ctx.httpAPI.MatrixStorage.upload_file(file_content,{
      credential,
      bucket_name:config.easynft.maxtrix_storage.bucket_name,
      file_name:file_name,
      is_verified:0,
      file_size:file_size,
      is_private:0,
      event_id,
      store_host
    });

    if(!Buffer.isBuffer(file_content))
      file_content.destroy();

    const res = await ctx.httpAPI.MatrixStorage.file_detail(condition);
    return res[0];
    
  }

  async getOne({cid,store_host}){

    const {ctx,config} = this;

    const metadata_buffer = await ctx.httpAPI.MatrixStorage.download_file({
      bucket_name:config.easynft.maxtrix_storage.bucket_name,
      cid,
      store_host:store_host
    });
    const metadata = JSON.parse(metadata_buffer.toString('utf8'));

    let status='complete';
    for(let file of metadata.properties.files) {
      const [stat] = await ctx.httpAPI.MatrixStorage.file_detail({
        bucket_name:config.easynft.maxtrix_storage.bucket_name,
        cid:file.cid,
        page_index:1,
        page_size:1
      });
      if (!stat || PENDING_STATUS.includes(stat.status)) {
        status = 'pending';
        break;
      }
    }    
    return {cid,metadata,status};
  }
  
  async findOne(cid){
    const {config,ctx} = this;

    const [metadataStat] = await ctx.httpAPI.MatrixStorage.file_detail({
      bucket_name:config.easynft.maxtrix_storage.bucket_name,
      cid,
      file_name:'metadata.json',
      page_index:1,
      page_size:1
    });

    if (!metadataStat || PENDING_STATUS.includes(metadataStat.status)) {
      return null;
    }
    
    return await this.getOne(metadataStat);
  }

  async find(conditions){

    const {config,ctx} = this;
    const stats = await ctx.httpAPI.MatrixStorage.file_detail({
      page_index:1,
      page_size:10,
      ...conditions,
      bucket_name:config.easynft.maxtrix_storage.bucket_name,
      file_name:'metadata.json'
    });

    if (stats.length<=0) {
      return stats;
    }

    return await Promise.all(stats.map(_=>this.getOne(_)));
  }
}

module.exports = NFTMetadataService;
