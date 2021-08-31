/**
 * @fileOverview app扩展
 * @name application.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { CID_GENERATOR } = require('../../constants');
const { createGenerator } = require('ipfs-cid');
const { BufferGenerator } = require('ipfs-cid/extensions/buffer');

const GENERATOR = Symbol('GENERATOR');

module.exports = {

  /**
   *
   * @return {import('ipfs-cid').ComposeGenerator}
   */
  get [CID_GENERATOR]() {
    if (!this[GENERATOR]) {
      const generator = createGenerator(this.config.easynft.cid);
      generator.mount(BufferGenerator.createInstance());
      this[GENERATOR] = generator;
    }
    return this[GENERATOR];
  },

};
