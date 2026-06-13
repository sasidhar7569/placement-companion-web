const { remote } = require('webdriverio');
const capabilities = require('../config/caps');
const ReportGenerator = require('../../shared/reportGenerator');
const logger = require('../../shared/logger');

let client;
const report = new ReportGenerator('appium-report.xlsx');

exports.mochaHooks = {
    beforeAll: async function() {
        this.timeout(60000); // Appium startup can be slow
        logger.info('Initializing Appium Driver...');
        try {
            client = await remote({
                path: '/wd/hub',
                port: 4723,
                capabilities: capabilities
            });
            global.mobileClient = client;
            global.report = report;
        } catch (err) {
            logger.error(`Appium Initialization Failed: Ensure Appium Server is running at 4723. Error: ${err.message}`);
            // We do not throw here for now, so tests fail gracefully rather than crashing suite
        }
    },

    afterEach: async function() {
        const testStatus = this.currentTest.state === 'passed' ? 'PASS' : 'FAIL';
        let screenshotPath = '';
        
        if (testStatus === 'FAIL' && client) {
            const MobileBasePage = require('../pages/BasePage');
            const page = new MobileBasePage(client);
            try {
                screenshotPath = await page.takeScreenshot(this.currentTest.title);
            } catch (e) {
                logger.error('Failed to take screenshot: ' + e.message);
            }
        }

        report.addResult({
            id: `TC_MOB_${Date.now().toString().slice(-4)}`,
            module: 'Mobile App',
            name: this.currentTest.title,
            description: 'Mobile Automation Execution',
            expected: 'Step executes successfully',
            actual: testStatus === 'PASS' ? 'Success' : this.currentTest.err?.message || 'Failure',
            status: testStatus,
            duration: this.currentTest.duration || 0,
            screenshot: screenshotPath
        });
    },

    afterAll: async function() {
        logger.info('Closing Appium Driver and Generating Report...');
        if (client) {
            await client.deleteSession();
        }
        await report.generate();
    }
};
