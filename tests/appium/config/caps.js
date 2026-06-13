const config = require('../../shared/config');

const capabilities = {
    platformName: config.mobile.platformName,
    'appium:deviceName': config.mobile.deviceName,
    'appium:platformVersion': config.mobile.platformVersion,
    'appium:appPackage': config.mobile.appPackage,
    'appium:appActivity': config.mobile.appActivity,
    'appium:automationName': config.mobile.automationName,
    'appium:noReset': true,
    'appium:fullReset': false
};

module.exports = capabilities;
