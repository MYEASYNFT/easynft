const { Command } = require('commander');
const fs = require('fs');
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
    .arguments('<config_path>', 'this is config path')
    .arguments('<file_path>')
    .option('-n, --name [name]', 'this is file name')
    .option('-dn, --description [description]', 'this is description')
    .option('-d, --decimals [decimals]', 'this is decimals')
    .option('-p, --properties [properties]', 'this is properties')
    .action(async (config_path, file_path, options, command) => {
        // console.log(`add command called params: ${JSON.stringify({
        //     file_path,
        //     options,
        // })}`);
        if (!fs.existsSync(config_path)) {
            console.log('error: config_path file is not exists')
            return;
        }
        const config = dotenv.config({path: config_path}).parsed;
        const api = new Api(config);
        const { name, description, decimals, properties } = options;
        let propertiesObj = null;
        try {
            propertiesObj = JSON.parse(properties || {});
        } catch (error) {
            console.log('error: properties format error. example: \'{"aa":"bb","cc":"dd"}\'')
            return;
        }
        if (!fs.existsSync(file_path)) {
            console.log('error: file_path is not exists')
            return;
        }

        const result = await api.add({
            file: fs.createReadStream(file_path),
            name: name,
            description: description,
            decimals: Number(decimals),
            properties: propertiesObj
        });
        console.log(JSON.stringify(result, null, 4));
    });


//--------------------------------------------------------------------------------
// getAll command
// node command getAll D:\\config.env
//--------------------------------------------------------------------------------
program
    .command('getAll')
    .arguments('<config_path>', 'this is config path')
    .description('getAll data from server')
    .action(async (config_path) => {
        if (!fs.existsSync(config_path)) {
            console.log('error: config_path file is not exists')
            return;
        }
        const config = dotenv.config({path: config_path}).parsed;
        const api = new Api(config);
        const result = await api.getAll();
        console.log(JSON.stringify(result, null, 4));
    });


//--------------------------------------------------------------------------------
// getOne command
// node command getOne D:\\config.env  Qmdn5Ggbr4VFV9gwTF4nh4cyipdZQJUAecrcJEQeM17b3e
//--------------------------------------------------------------------------------
program
    .command('getOne')
    .description('getOne data from server')
    .arguments('<config_path>', 'this is config path')
    .arguments('<cid>')
    .action(async (config_path, cid) => {
        if (!fs.existsSync(config_path)) {
            console.log('error: config_path file is not exists')
            return;
        }
        const config = dotenv.config({path: config_path}).parsed;
        const api = new Api(config);
        const result = await api.getOne({ cid });
        console.log(JSON.stringify(result, null, 4));
    });


if (!process.argv[2]) {
    program.help();
    console.log();
}
program.parse(process.argv);
