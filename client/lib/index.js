const HttpClient = require('./httpClient');
const config = require('./config');

/**
 * api-link: https://github.com/MatrixStorageTech2021/easynft/blob/master/server/plugins/easynft/API.md
 */
const client = new HttpClient(config);

/**
 * @returns {Promise<[
 *    {
 *        "cid":"maxasin69ets85wve0ipva5m5b2maqaz8lme08peag2mxcsuv",
 *        "metadata":{
 *           "name":"the nft name",
 *           "description":"the nft description",
 *           "image":"ipfs://maxasipb+86x486bxmmnj3vkj9sdtqkpcqmxwhuncm2h1jx8j",
 *           "decimals":123123,
 *            "properties":{
 *               "files":[
 *                   {
 *                       "cid":"maxasipb+86x486bxmmnj3vkj9sdtqkpcqmxwhuncm2h1jx8j",
 *                       "filename":"image file name"
 *                   }
 *               ]
 *           }
 *       },
 *       "status":"pending"
 *    }
 *]>}
 */
async function getAll() {
    const params = {};
    const path = '/easynft';
    const options = {};
    try {
        console.debug(`start getAll() param:${JSON.stringify({params, options})}`);
        const data = await client.get(path, params, options);
        console.debug(`end getAll() param:${JSON.stringify({params, options})} result:${JSON.stringify(data)}`);
        return data;
    } catch (error) {
        console.error('error getAll() error:', JSON.stringify({
            path,
            params,
            options,
            error
        }));
    }
}

/**
 * @param params
 * @returns {Promise<
 *
 * {
 *    "cid":"maxasin69ets85wve0ipva5m5b2maqaz8lme08peag2mxcsuv",
 *    "status":"pending"
 * }
 *
 * or
 *
 * {
 *     "cid":"maxasin69ets85wve0ipva5m5b2maqaz8lme08peag2mxcsuv",
 *     "metadata":{
 *         "name":"the nft name",
 *         "description":"the nft description",
 *        "image":"ipfs://maxasipb+86x486bxmmnj3vkj9sdtqkpcqmxwhuncm2h1jx8j",
 *         "decimals":123123,
 *         "properties":{
 *            "files":[
 *                {
 *                    "cid":"maxasipb+86x486bxmmnj3vkj9sdtqkpcqmxwhuncm2h1jx8j",
 *                    "filename":"image file name"
 *                }
 *            ]
 *        }
 *    },
 *     "status":"pending"
 * }
 * >}
 */
async function getOne(params) {
    const { cid } = params;
    if (!cid) {
        throw new Exception(4001, 'params cid is requred');
    }
    const path = `/easynft/${cid}`;
    const options = {};
    try {
        console.debug(`start getOne() param:${JSON.stringify({params, options})}`);
        const data = await client.get(path, params, options);
        console.debug(`end getOne() param:${JSON.stringify({params, options})} result:${JSON.stringify(data)}`);
        return data;
    } catch (error) {
        console.error('error getOne() error:', JSON.stringify({
            path,
            params,
            options,
            error
        }));
    }
}

/**
 *
 * @param {
 *     file: stirng  required
 *     name: stirng
 *     description: stirng
 *     decimals: stirng
 *     properties: stirng
 * }
 * @returns {Promise<
 * {
 *     "cid":"maxasin69ets85wve0ipva5m5b2maqaz8lme08peag2mxcsuv",
 *     "metadata":{
 *         "name":"the nft name",
 *         "description":"the nft description",
 *         "image":"ipfs://maxasipb+86x486bxmmnj3vkj9sdtqkpcqmxwhuncm2h1jx8j",
 *         "decimals":123123,
 *        "properties":{
 *            "files":[
 *                {
 *                     "cid":"maxasipb+86x486bxmmnj3vkj9sdtqkpcqmxwhuncm2h1jx8j",
 *                    "filename":"image file name"
 *                }
 *             ]
 *         }
 *     }
 * }
 * >}
 */
async function add(params) {
    const { file, name, description, decimals, properties } = params;
    const path = '/easynft';
    const options = {};
    if (!file) {
        throw new Exception(4001, 'params file is requred');
    }
    try {
        console.debug(`start add() param:${JSON.stringify({ params, options })}`);
        const data = await client.upload(path, params, options);
        console.debug(`end add() param:${JSON.stringify({ params, options })} result:${JSON.stringify(data)}`);
        return data;
    } catch (error) {
        console.error('error add() error:', JSON.stringify({
            path,
            params,
            options,
            error
        }));
    }
}

exports ={
    getAll,
    getOne,
    add
}