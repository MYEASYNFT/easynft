#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const program = new Command();
program.version('1.0.0', '-v, --version');
const Api = require('./index');

//--------------------------------------------------------------------------------
// add command
// node command add D:\\config.env D:\\a.png -n a.png -d 8888 -dn this is description -p '{"aa":"bb","cc":"dd"}'
//--------------------------------------------------------------------------------
program
    .command('add')
    .description('add data to server')
  .arguments('<file_path>')
  .option('-c, --config [config]','config file path',path.join(process.cwd(),'config.env'))
    .option('-n, --name [name]', 'this is file name')
    .option('-dn, --description [description]', 'this is description')
    .option('-d, --decimals [decimals]', 'this is decimals')
  .option('-p, --properties [properties]', 'this is properties',"{}")
    .action(async (file_path, options, command) => {
        if (!fs.existsSync(options.config)) {
            console.error('error: config file is not exists')
            return;
        }
      const config = dotenv.config({path: options.config}).parsed;
     const api = new Api(config);
      const { name, description, decimals, properties } = options;
        let propertiesObj = null;
        try {
            propertiesObj = JSON.parse(properties || {});
        } catch (error) {
            console.error('error: properties format error. example: \'{"aa":"bb","cc":"dd"}\'')
            return;
        }
        if (!fs.existsSync(file_path)) {
            console.error('error: file_path is not exists')
            return;
        }

        const result = await api.add({
            file: fs.createReadStream(file_path),
            name: name,
            description: description,
            decimals: Number(decimals),
            properties: propertiesObj
        });
       console.log(`easynft: add ${file_path} success`);
       console.log(JSON.stringify(result, null, 4));
    });


//--------------------------------------------------------------------------------
// list command
// node command getAll D:\\config.env
//--------------------------------------------------------------------------------
program
    .command('list')
  .description('list data from server')
  .option('-c, --config [config]','config file path',path.join(process.cwd(),'config.env'))
  .option('-p, --page [page]', 'index of page list',1)
  .option('-s, --size [size]', 'size of page list',5)
    .action(async (options) => {
        if (!fs.existsSync(options.config)) {
            console.error('error: options.config file is not exists')
            return;
        }
        const config = dotenv.config({path: options.config}).parsed;
        const api = new Api(config);
      const result = await api.getAll(options);
      console.log(`easynft: list success`);
       console.log(JSON.stringify(result, null, 4));
    });


//--------------------------------------------------------------------------------
// get command
// node command get D:\\config.env  Qmdn5Ggbr4VFV9gwTF4nh4cyipdZQJUAecrcJEQeM17b3e
//--------------------------------------------------------------------------------
program
    .command('get')
    .description('get data from server')
  .arguments('<cid>')
  .option('-c, --config [config]','config file path',path.join(process.cwd(),'config.env'))
  .action(async (cid,options) => {
        if (!fs.existsSync(options.config)) {
            console.error('error: options.config file is not exists')
            return;
        }
        const config = dotenv.config({path: options.config}).parsed;
        const api = new Api(config);
    const result = await api.getOne({ cid });
     console.log(`easynft: get ${cid} success`);
    console.log(JSON.stringify(result, null, 4));
    });


if (!process.argv[2]) {
    program.help();
}
program.parse(process.argv);
