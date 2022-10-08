'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = (env, argv) =>
  merge(common, {
    entry: {
      popup: PATHS.src + '/popup.js',
      background: PATHS.src + '/background.js',
      authorize: PATHS.src + '/authorize.js',
      baekjoon: PATHS.src + '/baekjoon.js',
      programmers: PATHS.src + '/programmers.js',
      swexpertacademy:  PATHS.src + '/swexpertacademy.js',
    },
    devtool: argv.mode === 'production' ? false : 'source-map',
  });

module.exports = config;
