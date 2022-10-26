'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = (env, argv) =>
  merge(common, {
    entry: {
      background: PATHS.src + '/background/background.js',
      authorize: PATHS.src + '/authorize/authorize.js',
      baekjoon: PATHS.src + '/baekjoon/baekjoon.js',
      programmers: PATHS.src + '/programmers/programmers.js',
      swexpertacademy: PATHS.src + '/swexpertacademy/swexpertacademy.js',
    },
    devtool: argv.mode === 'production' ? false : 'source-map',
  });

module.exports = config;
