var colors = require('colors');
var fs = require('fs');
var path = require('path');

var checkDependency = require('./checkDependency');

module.exports = function runPreFlight(cwd, silent, stamp) {
  if (!silent) console.info(colors.cyan('Starting pre-flight checks'));

  if (!fs.existsSync(path.resolve(cwd + '/package.json'))) {
    console.error(colors.red('Could not find package json in: ' + cwd));
    process.exit(1);
  }
  var packageJSON;

  try {
    packageJSON = JSON.parse(fs.readFileSync(path.resolve(cwd + '/package.json'), 'utf8'));
  } catch (e) {
    console.error(colors.red('The package.json file found did not contain valid JSON'));
    process.exit(1);
  }
  var allGood = true;

  if (!silent) console.info(colors.cyan('Processing production dependencies'));
  Object.keys(packageJSON.dependencies || {}).forEach(function eachDep(dep) {
    var version = packageJSON.dependencies[dep];
    allGood = checkDependency(cwd, dep, version) && allGood;
  });

  if (!silent) console.info(colors.cyan('Processing development dependencies'));
  Object.keys(packageJSON.devDependencies || {}).forEach(function eachDep(dep) {
    var version = packageJSON.devDependencies[dep];
    allGood = checkDependency(cwd, dep, version) && allGood;
  });

  if (!silent) console.info(colors.cyan('Processing optional dependencies'));
  Object.keys(packageJSON.optionalDependencies || {}).forEach(function eachDep(dep) {
    var version = packageJSON.optionalDependencies[dep];
    allGood = checkDependency(cwd, dep, version, true) && allGood;
  });

  if (allGood) {
    console.log(colors.green('Dependencies are all up to date, looking good!'));
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
