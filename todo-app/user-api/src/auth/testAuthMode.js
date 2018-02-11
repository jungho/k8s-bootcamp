const base64 = require('base-64');
const utf8 = require('utf8');
const HttpStatus = require('http-status-codes');

const logger = require('../logger');


module.exports = (req, res, next) => {
    const authToken = req.get('Authorization');
    logger.info(`Test authentication mode - received header token = ${authToken}`);

    if (!authToken) {
        logger.info('Test authentication mode - no token found in request header');
        return res.status(HttpStatus.UNAUTHORIZED).send({message: 'Token is invalid'});
    }

    const tokenToDecode = authToken.replace(/^Bearer\s/, '');
    try {
        const userData = utf8.decode(base64.decode(tokenToDecode));
        req.user = JSON.parse(userData);
    } catch (e) {
        return res.status(HttpStatus.UNAUTHORIZED).send({message: 'Error decoding the token'});
    }

    logger.info(`Test authentication mode - token decoded successfully where token = ${tokenToDecode}`);

    next();
};