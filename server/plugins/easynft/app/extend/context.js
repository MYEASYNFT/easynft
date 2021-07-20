/**
 * @fileOverview 上下文扩展
 * @name context.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { CID_GENERATOR } = require('../../constants');
const { createGenerator } = require('ipfs-cid');

const GENERATOR = Symbol('GENERATOR');

module.exports = {

  /**
   *
   * @return {import('ipfs-cid').ComposeGenerator}
   */
  get [CID_GENERATOR]() {
    if (!this[GENERATOR]) {
      this[GENERATOR] = createGenerator(this.app.config.easynft.cid);
    }
    return this[GENERATOR];
  },

};
