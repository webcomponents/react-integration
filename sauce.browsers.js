const sauceBrowsers = {
  // Chrome
  chrome_latest_linux: {
    browserName: 'chrome',
    platform: 'Linux',
    version: 'latest'
  },
  chrome_latest_windows: {
    browserName: 'chrome',
    platform: 'Windows 10',
    version: 'latest'
  },
  chrome_latest_osx: {
    browserName: 'chrome',
    platform: 'OS X 10.11',
    version: 'latest'
  },
  chrome_latest_1: {
    browserName: 'chrome',
    platform: 'Linux',
    version: 'latest-1'
  },
  chrome_latest_2: {
    browserName: 'chrome',
    platform: 'Linux',
    version: 'latest-2'
  },
  chrome_latest_3: {
    browserName: 'chrome',
    platform: 'Linux',
    version: 'latest-3'
  },
  chrome_latest_4: {
    browserName: 'chrome',
    platform: 'Linux',
    version: 'latest-4'
  },

  // Firefox
  firefox_latest_linux: {
    browserName: 'firefox',
    platform: 'Linux',
    version: 'latest'
  },
  firefox_latest_windows: {
    browserName: 'firefox',
    platform: 'Windows 10',
    version: 'latest'
  },
  firefox_latest_osx: {
    browserName: 'firefox',
    platform: 'OS X 10.11',
    version: 'latest'
  },
  firefox_latest_1: {
    browserName: 'firefox',
    platform: 'Linux',
    version: 'latest-1'
  },
  firefox_latest_2: {
    browserName: 'firefox',
    platform: 'Linux',
    version: 'latest-2'
  },
  firefox_latest_3: {
    browserName: 'firefox',
    platform: 'Linux',
    version: 'latest-3'
  },
  firefox_latest_4: {
    browserName: 'firefox',
    platform: 'Linux',
    version: 'latest-4'
  },
  firefox_latest_5: {
    browserName: 'firefox',
    platform: 'Linux',
    version: 'latest-5'
  },
  firefox_latest_6: {
    browserName: 'firefox',
    platform: 'Linux',
    version: 'latest-6'
  },

  // Safari (<= 8 is severely crippled)
  safari_latest: {
    browserName: 'safari',
    version: 'latest',
    platform: 'OS X 10.11'
  },

  // IE
  internet_explorer_11: {
    browserName: 'internet explorer',
    version: '11',
    platform: 'Windows 8.1'
  },
  internet_explorer_10: {
    browserName: 'internet explorer',
    version: '10',
    platform: 'Windows 8'
  },
  internet_explorer_9: {
    browserName: 'internet explorer',
    version: '9',
    platform: 'Windows 7'
  },

  // Edge
  microsoftedge_latest: {
    browserName: 'microsoftedge',
    platform: 'Windows 10',
    version: 'latest'
  },

  // Opera (they don't have Opera latest with Blink)
  opera_12: {
    browserName: 'opera',
    platform: 'Windows 7',
    version: '12.12'
  },

  // iOS
  iphone: {
    browserName: 'iphone',
    platform: 'OS X 10.10',
    version: 'latest',
    deviceName: 'iPhone Simulator'
  },

  // Android (when they update their images to 43+)
  android: {}
};

Object.keys(sauceBrowsers).forEach(function (key) {
  sauceBrowsers[key].base = 'SauceLabs';
});


module.exports = sauceBrowsers;