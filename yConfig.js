import { join } from 'path';
import { existsSync } from 'fs';

// defaults

import yConfigDefaults from './yConfig.defaults';

// local overides, optional

const localConfig = join(__dirname, 'yConfig.local.js');

let yConfigLocal = {};
if (existsSync(localConfig)) {
  yConfigLocal = require(localConfig);
  // can be an es6 module with a default export
  if (yConfigLocal.default) {
    yConfigLocal = yConfigLocal.default;
  }
}

// merge it together

const yConfig = Object.assign({}, yConfigDefaults, yConfigLocal);

export default yConfig;