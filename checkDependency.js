var colors = require('colors');
var fs = require('fs');
var path = require('path');
var semver = require('semver');

module.exports = function checkDependency(cwd, name, version, optional) {
  if (!fs.existsSync(path.resolve(cwd + '/node_modules/' + name))
    || !fs.existsSync(path.resolve(cwd + '/node_modules/' + name + '/package.json'))) {
    if (optional) {
      return true;
    }
    console.error(colors.red('Could not find required dependency: ' + name));
    console.error(colors.red('       Try running `npm install` to fetch missing dependencies'));
    return false;
  }
  var modulePackageJSON;
  try {
    modulePackageJSON = JSON.parse(fs.readFileSync(path.resolve(cwd + '/node_modules/' + name + '/package.json'), 'utf8'));
  } catch (e) {
    console.error(colors.red('Required dependency has an incomplete or corrupt package.json: ' + name));
    console.error(colors.red('       Try running `npm install ' + name + '` to fix the bad dependency'));
    return false;
  }
  if (!semver.valid(modulePackageJSON.version)) {
    console.error(colors.red('Required dependency has a bad semver string in it\'s package.json: ' + name + ' (' + modulePackageJSON.version + ')'));
    return false;
  }
  if (!semver.validRange(version) || semver.satisfies(modulePackageJSON.version, version)) {
    return true;
  }
  console.error(colors.red('Required dependency does not match the required version: ' + name));
  console.error(colors.red('       Current Version: ' + modulePackageJSON.version));
  console.error(colors.red('       Required Version Range: ' + version));
  console.error(colors.red('       Try running `npm upgrade ' + name + '` to update the dependency'));
  return false;
}
