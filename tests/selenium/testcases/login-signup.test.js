const { expect } = require('chai');
const { Builder, By } = require('selenium-webdriver');
const config = require('../../shared/config');

describe('Login & Signup Testing', function() {
    let driver;

    before(function() {
        driver = global.driver;
    });

    it('should navigate to login page', async function() {
        await driver.get(config.web.baseUrl + 'login');
        // Add specific assertions here
    });
});
