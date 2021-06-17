const { Command } = require('commander');
const fs = require('fs');
const program = new Command();
program.version('1.0.0', '-v, --version');
const api = require('./index');

//--------------------------------------------------------------------------------
// add command
// node command.js add D:\\a.png -n a.png -d 8888 -dn this is description -p '{"aa":"bb","cc":"dd"}'
//--------------------------------------------------------------------------------
program
    .command('add')
    .description('add data to server')
    .arguments('<file_path>')
    .option('-n, --name [name]', 'this is file name')
    .option('-dn, --description [description]', 'this is description')
    .option('-d, --decimals [decimals]', 'this is decimals')
    .option('-p, --properties [properties]', 'this is properties')
    .action(async (file_path, options, command) => {
        // console.log(`add command called params: ${JSON.stringify({
        //     file_path,
        //     options,
        // })}`);
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
// node command.js getAll
//--------------------------------------------------------------------------------
program
    .command('getAll')
    .description('getAll data from server')
    .action(async () => {
        const result = await api.getAll();
        console.log(JSON.stringify(result, null, 4));
    });


//--------------------------------------------------------------------------------
// getOne command
// node command.js getOne QmUzA3j2VBbmajMVJwCL5JYim86WaJuAj5B4HVWpFyQZLV
//--------------------------------------------------------------------------------
program
    .command('getOne')
    .description('getOne data from server')
    .arguments('<cid>')
    .action(async (cid) => {
        const result = await api.getOne({ cid });
        console.log(JSON.stringify(result, null, 4));
    });


if (!process.argv[2]) {
    program.help();
    console.log();
}
program.parse(process.argv);
