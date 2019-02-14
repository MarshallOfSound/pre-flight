#!/usr/bin/env node

var path = require('path');
var program = require('commander');

var preFlight = require('./index.js');

function resolvePath(val) {
  return path.resolve(val);
}

program
  .version(require('./package.json').version)
  .option('-s, --silent', 'Runs pre-flight checks silently until failure')
  .option('--directory <path>', 'Sets the directory of the package.json to check', resolvePath)
  .option('--stamp <path>', 'Outputs a file indicating success, will not output the file on failure', resolvePath)
  .parse(process.argv);

program.directory = program.directory || process.cwd();
program.silent = program.silent || false;

preFlight(program.directory, program.silent, program.stamp)
