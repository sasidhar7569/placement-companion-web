const axios = require('axios');
const logger = require('./logger');

async function verifyAppIsReachable(url) {
    try {
        logger.info(`Performing health check for URL: ${url}`);
        const response = await axios.get(url, { timeout: 5000 });
        if (response.status >= 200 && response.status < 400) {
            logger.info(`Health check passed. URL ${url} is accessible.`);
            return true;
        }
    } catch (error) {
        logger.error(`Health check failed. Ensure the application is running at ${url}. Error: ${error.message}`);
        return false;
    }
    return false;
}

module.exports = { verifyAppIsReachable };
