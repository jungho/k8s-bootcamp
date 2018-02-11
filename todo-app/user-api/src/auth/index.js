const testAuthMode = require('./testAuthMode');
const azureADAuthMode = require('./azureADAuthMode');

const logger = require('../logger');


module.exports = (testMode) => {
    if (testMode === 'true') {
        logger.info(`Using test authentication mode - testMode = ${testMode}`);
        return testAuthMode;
    } else {
        logger.info(`Using Azure AD authentication mode - testMode = ${testMode}`);
        return azureADAuthMode;
    }
};