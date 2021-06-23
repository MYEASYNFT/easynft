const debug = require('debug')('easynft-sdk');
const HttpClient = require('./httpClient');
const Exception = require('./exception');

module.exports = class {
    constructor(config) {
        if (!config.APP_ID) {
            throw new Exception(4000,"config APP_ID is requred");
        }
        if (!config.APP_SECRET) {
            throw new Exception(4000,"config APP_SECRET is requred");
        }
        if (!config.APP_VERSION) {
            throw new Exception(4000,"config APP_VERSION is requred");
        }
        if (!config.HOST) {
            throw new Exception(4000, "config HOST is requred");
        }
        this.appid = config.APP_ID;
        this.appsecret = config.APP_SECRET;
        this.appversion = config.APP_VERSION;
        this.host = config.HOST;
        this.timeout = config.HTTP_TIME_OUT || 60 * 1000;
        /**
         * api-link: https://github.com/MatrixStorageTech2021/easynft/blob/master/server/plugins/easynft/API.md
         */
        this.client = new HttpClient(config);
    }

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
    async getAll(opts) {
        const params = {};
        const path = '/easynft';
      const options = {query:{page_index:opts.page,page_size:opts.size}};
        try {
            debug(`start getAll() param:${JSON.stringify({params, options})}`);
            const data = await this.client.get(path, params, options);
            debug(`end getAll() param:${JSON.stringify({params, options})}`);
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
    async getOne(params) {
        const { cid } = params;
        if (!cid) {
            throw new Exception(4001, 'params cid is requred');
        }
        const path = `/easynft/${cid}`;
        const options = {};
        try {
            debug(`start getOne() param:${JSON.stringify({params, options})}`);
            const data = await this.client.get(path, params, options);
            debug(`end getOne() param:${JSON.stringify({params, options})} result:${JSON.stringify(data)}`);
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
     *     file: file object  required
     *     name: stirng
     *     description: stirng
     *     decimals: big int
     *     properties: object
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
    async add(params) {
        const { file, name, description, decimals, properties } = params;
        const otherParams = { name, description, decimals, properties };
        const path = '/easynft';
        const options = {};
        if (!file) {
            throw new Exception(4001, 'params file is requred');
        }
        try {
            debug(`start add() param:${JSON.stringify({ params: otherParams, options })}`);
            const data = await this.client.upload(path, file, otherParams, options);
            debug(`end add() param:${JSON.stringify({ otherParams, options })} result:${JSON.stringify(data)}`);
            return data;
        } catch (error) {
            console.error('error add() error:', JSON.stringify({
                path,
                params: otherParams,
                options,
            }), { error: error && error.code == 403 ? 'unauthorized' : error });
        }
    }
}
