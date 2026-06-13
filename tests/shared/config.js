require('dotenv').config();

const config = {
    web: {
        baseUrl: process.env.FRONTEND_URL || 'http://localhost:5173/',
        backendUrl: process.env.BACKEND_URL || 'http://10.141.95.184:5000/',
        browser: 'chrome',
        timeout: 10000,
    },
    mobile: {
        deviceName: process.env.ANDROID_DEVICE_NAME || 'emulator-5554',
        platformVersion: process.env.ANDROID_PLATFORM_VERSION || '11.0',
        appPackage: process.env.ANDROID_APP_PACKAGE || 'com.example.webapp',
        appActivity: process.env.ANDROID_APP_ACTIVITY || '.MainActivity',
        platformName: 'Android',
        automationName: 'UiAutomator2',
    }
};

module.exports = config;
