import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import semver from 'semver';

export function checkDependency(cwd: string, name: string, version: string, optional: boolean) {
  if (!fs.existsSync(path.resolve(cwd + '/node_modules/' + name))
    || !fs.existsSync(path.resolve(cwd + '/node_modules/' + name + '/package.json'))) {
    if (optional) {
      return true;
    }
    console.error(chalk.red('Could not find required dependency: ' + name));
    console.error(chalk.red('       Try running `npm install` to fetch missing dependencies'));
    return false;
  }
  var modulePackageJSON;
  try {
    modulePackageJSON = JSON.parse(fs.readFileSync(path.resolve(cwd + '/node_modules/' + name + '/package.json'), 'utf8'));
  } catch (e) {
    console.error(chalk.red('Required dependency has an incomplete or corrupt package.json: ' + name));
    console.error(chalk.red('       Try running `npm install ' + name + '` to fix the bad dependency'));
    return false;
  }
  if (!semver.valid(modulePackageJSON.version)) {
    console.error(chalk.red('Required dependency has a bad semver string in it\'s package.json: ' + name + ' (' + modulePackageJSON.version + ')'));
    return false;
  }
  if (!semver.validRange(version) || semver.satisfies(modulePackageJSON.version, version)) {
    return true;
  }
  console.error(chalk.red('Required dependency does not match the required version: ' + name));
  console.error(chalk.red('       Current Version: ' + modulePackageJSON.version));
  console.error(chalk.red('       Required Version Range: ' + version));
  console.error(chalk.red('       Try running `npm upgrade ' + name + '` to update the dependency'));
  return false;
}
