import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';

import { checkDependency } from './check-dependency.js';

type PackageJSON = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
}

export function runPreFlight(cwd: string, silent: boolean, stamp?: string) {
  if (!silent) console.info(chalk.cyan('Starting pre-flight checks'));

  if (!fs.existsSync(path.resolve(cwd + '/package.json'))) {
    console.error(chalk.red('Could not find package json in: ' + cwd));
    process.exit(1);
  }
  let packageJSON: PackageJSON;

  try {
    packageJSON = JSON.parse(fs.readFileSync(path.resolve(cwd + '/package.json'), 'utf8'));
  } catch (e) {
    console.error(chalk.red('The package.json file found did not contain valid JSON'));
    process.exit(1);
  }
  var allGood = true;

  if (!silent) console.info(chalk.cyan('Processing production dependencies'));
  const deps = packageJSON.dependencies || {};
  Object.keys(deps).forEach(function eachDep(dep) {
    var version = deps[dep];
    allGood = checkDependency(cwd, dep, version, false) && allGood;
  });

  if (!silent) console.info(chalk.cyan('Processing development dependencies'));
  const devDeps = packageJSON.devDependencies || {};
  Object.keys(devDeps).forEach(function eachDep(dep) {
    var version = devDeps[dep];
    allGood = checkDependency(cwd, dep, version, false) && allGood;
  });

  if (!silent) console.info(chalk.cyan('Processing optional dependencies'));
  const optDeps = packageJSON.optionalDependencies || {};
  Object.keys(optDeps).forEach(function eachDep(dep) {
    var version = optDeps[dep];
    allGood = checkDependency(cwd, dep, version, true) && allGood;
  });

  if (allGood) {
    console.log(chalk.green('Dependencies are all up to date, looking good!'));
    if (stamp) {
      fs.writeFileSync(stamp, 'pre-flight-stamp');
    }
  } else {
    if (stamp && fs.existsSync(stamp)) {
      fs.unlinkSync(stamp);
    }
    process.exit(1);
  }
}
