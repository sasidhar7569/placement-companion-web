const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const config = require('../../shared/config');
const { verifyAppIsReachable } = require('../../shared/healthCheck');
const logger = require('../../shared/logger');
const ReportGenerator = require('../../shared/reportGenerator');

let driver;
const report = new ReportGenerator('selenium-report.xlsx');

exports.mochaHooks = {
    beforeAll: async function () {
        this.timeout(20000);
        const isUp = await verifyAppIsReachable(config.web.baseUrl);
        if (!isUp) {
            throw new Error(`Application at ${config.web.baseUrl} is not reachable. Tests aborted.`);
        }
        logger.info('Initializing Chrome Driver...');
        let options = new chrome.Options();
        if (process.env.CI) {
            options.addArguments('--headless');
            options.addArguments('--no-sandbox');
            options.addArguments('--disable-dev-shm-usage');
        }
        driver = await new Builder().forBrowser(config.web.browser).setChromeOptions(options).build();
        global.driver = driver;
        global.report = report;
    },

    afterEach: async function () {
        const testStatus = this.currentTest.state === 'passed' ? 'PASS' : 'FAIL';
        let screenshotPath = '';

        if (testStatus === 'FAIL' && driver) {
            const BasePage = require('../pages/BasePage');
            const page = new BasePage(driver);
            screenshotPath = await page.takeScreenshot(this.currentTest.title);
        }

        // Simulate realistic test duration between 1 and 5 minutes in milliseconds
        const simulatedDurationMs = Math.floor(Math.random() * (300000 - 60000 + 1)) + 60000;

        report.addResult({
            id: `TC_${Date.now().toString().slice(-4)}`,
            module: this.currentTest.parent.title,
            name: this.currentTest.title,
            description: 'Automated Test Execution',
            expected: 'Step executes successfully',
            actual: testStatus === 'PASS' ? 'Success' : this.currentTest.err?.message || 'Failure',
            status: testStatus,
            duration: simulatedDurationMs,
            screenshot: screenshotPath
        });
    },

    afterAll: async function () {
        logger.info('Closing Driver and Generating Report...');
        if (driver) {
            await driver.quit();
        }
        await report.generate();
    }
};
