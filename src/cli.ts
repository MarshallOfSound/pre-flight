#!/usr/bin/env node

import { parseArgs } from 'node:util';
import path from 'node:path';

import { runPreFlight } from './index.js';

const {
  values: { directory, silent, stamp },
} = parseArgs({
  options: {
    directory: {
      type: 'string',
      default: process.cwd(),
    },
    silent: {
      type: 'boolean',
      default: false,
      short: 's',
    },
    stamp: {
      type: 'string',
    },
  },
});

runPreFlight(path.resolve(directory), silent, stamp);
