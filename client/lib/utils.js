const createHash = require('crypto').createHash;


// 创建签名 10分钟内有效
function createSignature(appsecret) {
    const nonce = Math.round(Math.random() * 9000000000 + 1000000000).toString();
    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    const sortedParamsStr = [nonce, timestamp, appsecret].sort().join('');
    const sign = createHash('sha1').update(sortedParamsStr).digest('hex');
    const signature = `signature=${sign}&timestamp=${timestamp}&nonce=${nonce}`;
    return signature;
}

exports ={
    createSignature
}