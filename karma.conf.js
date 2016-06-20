const webpackConfig = require('./webpack.config');
const sauceBrowsers = require('./sauce.browsers');

module.exports = function (config) {
  // list of files / patterns to load in the browser
  // all dependancies should be traced through here
  var files = ['test/unit.js'];

  // preprocess matching files before serving them to the browser
  // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
  // webpack will trace and watch all dependancies
  var preprocessors = {
    'test/unit.js': [ 'webpack', 'sourcemap' ]
  };

  if (process.argv.indexOf('--perf') > -1) {
    files = [ require.resolve('../benchmark/benchmark.js'), 'test/perf.js' ];
    preprocessors = {
      'test/perf.js': [ 'webpack', 'sourcemap' ]
    };
  }

  config.set(Object.assign({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    // setting to process.cwd will make all paths start in current component directory
    basePath: process.cwd(),

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [ 'mocha', 'chai', 'sinon-chai' ],

    // list of files / patterns to load in the browser
    files: files,

    // list of files to exclude
    exclude: [],

    // list of preprocessors
    preprocessors: preprocessors,

    // karma watches the test entry points
    // (you don't need to specify the entry option)
    // webpack watches dependencies
    webpack: Object.assign({}, webpackConfig, {
      devtool: 'inline-source-map',
      entry: undefined
    }),

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [ 'progress' ],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [ 'Chrome', 'Firefox' ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  }, process.argv.indexOf('--saucelabs') === -1 ? {} : {
    sauceLabs: {
      testName: 'Unit Tests',
      recordScreenshots: false,
      connectOptions: { verbose: true }
    },
    customLaunchers: sauceBrowsers,
    browsers: Object.keys(sauceBrowsers),
    captureTimeout: 120000,
    reporters: [ 'saucelabs', 'dots' ],
    autoWatch: false,
    concurrency: 5,
    client: {}
  }));
};
