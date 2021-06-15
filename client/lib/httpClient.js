const request = require('request');
const { createSignature } = require('./utils');
const Exception = require('./exception');
const JSONbig = require('json-bigint');

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
    }

    createBaseHeader() {
        return {
            "AppId": this.appid, // 系统分配给你的appid
            "AppVersion": this.appversion, // 客户端版本
            "Signature": createSignature(this.appsecret), // 生产签名
        };
    }

    async get(url, params, options) {
        const opts = options || {};
        const optHeaders = opts.headers || {};
        const headers = Object.assign(this.createBaseHeader(), optHeaders);
        return new Promise((resolve, reject) => {
            request({
                baseUrl: this.host,
                url: url,
                method: "GET",
                timeout: this.timeout,
                headers: headers,
                form: params || {},
            }, (error, response, body) => {
                try {
                    this.errorCheck(error, response, body);
                    resolve(JSONbig.parse(body))
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    async post(url, params, options) {
        const opts = options || {};
        const optHeaders = opts.headers || {};
        const headers = Object.assign(this.createBaseHeader(), optHeaders);
        return new Promise((resolve, reject) => {
            request({
                baseUrl: this.host,
                url: url,
                method: "POST",
                timeout: this.timeout,
                headers: headers,
                body: params || {},
            }, (error, response, body) => {
                try {
                    this.errorCheck(error, response, body);
                    resolve(JSONbig.parse(body))
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    async upload(url, file, params, options) {
        if (!file) {
            throw new Exception(4001, 'params file is requred');
        }
        const { name, description, decimals, properties } = params;
        const opts = options || {};
        const optHeaders = opts.headers || {};
        const headers = Object.assign(this.createBaseHeader(), optHeaders);
        return new Promise((resolve, reject) => {
            request({
                baseUrl: this.host,
                url: url,
                method: "POST",
                timeout: this.timeout,
                headers: headers,
                formData: {
                    file,
                    name,
                    description,
                    decimals,
                    properties: JSON.stringify(properties || {}),
                },
            }, (error, response, body) => {
                try {
                    console.log('-----------------------------')
                    this.errorCheck(error, response, body);
                    resolve(JSONbig.parse(body))
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    errorCheck(error, response, body) {
        if (error) {
            console.warn(error);
            throw error;
        }
        if (response.statusCode != 200) {
            throw new Exception(response.statusCode, response.body);
        }
    }
}

