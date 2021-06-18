'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }

  easynft:{
    package: 'egg-easynft',
    enable:true
  },

  httpLogger:{
    enable: true,
    package: 'egg-http-logger'
  }
};
