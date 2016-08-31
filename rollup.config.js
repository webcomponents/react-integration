const config = require('skatejs-build/rollup.config');
const pkg = require('skatejs-build/package');

const deps = Object.keys(pkg.dependencies || []);
config.external = id => {
  if (id === 'react' || id === 'react-dom') {
    return true;
  }

  return deps.indexOf(id) > -1
}

module.exports = config;
