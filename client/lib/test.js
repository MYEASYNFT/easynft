const { getAll, getOne, add } = require('./index');
const fs = require('fs');

class Test {
    static async addTest() {
        console.debug('==========================start addTest=============================');
        const result = await add({
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

    static async getAllTest() {
        console.debug('start getAllTest');
        const result = await getAll();
        console.log(JSON.stringify(result, null , 4));
        console.debug('end getAllTest');
    }

    static async getOneTest() {
        console.debug('start getOneTest');
        const result = await getOne( { cid: 'QmUzA3j2VBbmajMVJwCL5JYim86WaJuAj5B4HVWpFyQZLV' });
        console.log(JSON.stringify(result, null , 4));
        console.debug('end getOneTest');
    }
}

async function exec() {
    //await Test.addTest();
    await Test.getAllTest();
}
exec();
