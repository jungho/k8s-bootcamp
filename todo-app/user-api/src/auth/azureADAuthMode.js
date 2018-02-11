const passport = require('passport');
const BearerStrategy = require('passport-azure-ad').BearerStrategy;

const config = require('../config');
const logger = require('../logger');

const strategy = new BearerStrategy(
    {
        identityMetadata: config.azureIdentityMetaData,
        clientID: config.azureClientId,
        validateIssuer: false,
        passReqToCallback: true,
        isB2C: false,
        allowMultipleAudiencesInToken: false
    },
    (req, {upn, email, given_name, family_name}, done) => {
        logger.info(`AD Response: UPN=${upn}, EMAIL=${email}, GIVEN_NAME=${given_name}, FAMILY_NAME=${family_name}`)
        done(null, {email: upn || email, firstName: given_name, lastName: family_name});
    }
);

passport.use(strategy);

module.exports = passport.authenticate('oauth-bearer', {session: false});