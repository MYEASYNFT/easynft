const ApiClient = require('./index');
const fs = require('fs');

class Test {

    constructor(config) {
        this.client = new ApiClient(config);
    }

    async addTest() {
        console.debug('==========================start addTest=============================');
        const result = await this.client.add({
            file: fs.createReadStream('D:\\a.png'),
            name: 'this is name',
            description: 'this is description',
            decimals: 11111111111,
            // 自定义可选属性
            properties: {
                aa: 1,
                bb: 'c'
            },
        });
        console.log(JSON.stringify(result, null , 4));
        console.debug('==========================end addTest=============================');
    }

    async getAllTest() {
        console.debug('start getAllTest');
        const result = await this.client.getAll();
        console.log(JSON.stringify(result, null , 4));
        console.debug('end getAllTest');
    }

    async getOneTest() {
        console.debug('start getOneTest');
        const result = await this.client.getOne( { cid: 'QmUzA3j2VBbmajMVJwCL5JYim86WaJuAj5B4HVWpFyQZLV' });
        console.log(JSON.stringify(result, null , 4));
        console.debug('end getOneTest');
    }
}

async function exec() {
    const config = {
        APP_ID: 'LogG1623754383',
        APP_SECRET: 'xxx',
        APP_VERSION: '1.0.0',
        HOST: 'http://localhost:7001',
        // 请求超时时间，单位毫秒
        HTTP_TIME_OUT: 30 * 1000,
    };
    const test = new Test(config);
    //await test.addTest();
    await test.getAllTest();
}
exec();
