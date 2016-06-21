const base = require('skatejs-build/karma.conf');
module.exports = function (config) {
  base(config);

  // WebComponentsJS for testing native APIs in older browsers.
  config.files = [
    'node_modules/webcomponents.js/CustomElements.js',
  ].concat(config.files);

  // Ensure mobile browsers have enough time to run.
  config.browserNoActivityTimeout = 60000;
};
