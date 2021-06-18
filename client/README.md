# easynft-client

nft client


### Command Example
```bash
create D:\\config.env file

APP_ID=LogG1623754383
APP_SECRET=xxx
APP_VERSION=1.0.0
HOST=http://localhost:7001
HTTP_TIME_OUT=30000

command help
$ cd lib
$ node command -h

add test demo (the D:\\a.png needs to be created by you)
$ node command add D:\\config.env D:\\a.png -n a.png -d 8888 -dn this is description -p '{"aa":"bb","cc":"dd"}'

getAll test demo
$ node command getAll D:\\config.env

getOne test demo
$ node command getOne D:\\config.env Qmdn5Ggbr4VFV9gwTF4nh4cyipdZQJUAecrcJEQeM17b3e

```

### Code Example

```javascript
const ApiClient = require('./index');
const fs = require('fs');
const config = {
    APP_ID: 'LogG1623754383',
    APP_SECRET: 'xxx',
    APP_VERSION: '1.0.0',
    HOST: 'http://localhost:7001',
    // 请求超时时间，单位毫秒
    HTTP_TIME_OUT: 30 * 1000,
};
const client = new ApiClient(config);

console.debug('==========================start addTest=============================');
let result = await client.add({
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

console.debug('start getAllTest');
result = await client.getAll();
console.log(JSON.stringify(result, null , 4));
console.debug('end getAllTest');

console.debug('start getOneTest');
result = await client.getOne( { cid: 'QmUzA3j2VBbmajMVJwCL5JYim86WaJuAj5B4HVWpFyQZLV' });
console.log(JSON.stringify(result, null , 4));
console.debug('end getOneTest');



```
