const router = require('express').Router();
const HttpStatus = require('http-status-codes');

const config = require('./config');
const authMiddleware = require('./auth')(config.isTestMode);

const dao = require('./dao');
const UserDTO = require('./dto');
const logger = require('./logger');


const findUserByEmail = async (email, res) => {
    logger.info(`GET /user - where email = ${email}`);

    try {
        const user = await dao.findUserByEmail(email);
        if (!user) {
            logger.info(`GET /user - user not found where email = ${email}`);
            return res.sendStatus(HttpStatus.NOT_FOUND);
        }

        logger.info(`GET /user - user found where email = ${email}`);
        res.send(new UserDTO(user));
    } catch (e) {
        logger.error(`Error getting user where email = ${email}`);
        res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
};

/**
 * @swagger
 * /user/healthcheck:
 *     get:
 *         tags:
 *             - Users
 *         description: Used to ping the User API
 *         responses:
 *             200:
 *                 description: User API is running
 */
router.get('/healthcheck', (req, res) => {
    logger.info('Received a health-check request from K8S.');
    res.sendStatus(HttpStatus.OK);
});

/**
 * @swagger
 * /user/{email}:
 *     get:
 *         tags:
 *             - Users
 *         description: Returns a user having the specified email
 *         produces:
 *             - application/json
 *         parameters:
 *             - name: email
 *               description: Email of the user to return
 *               in: path
 *               required: true
 *               type: string
 *         responses:
 *             200:
 *                 description: The user having the specified email
 *                 schema:
 *                     $ref: '#/definitions/User'
 *             404:
 *                 description: No user matching the specified email
 *             500:
 *                 description: Unexpected error occurred
 */
router.get('/:email', async ({params: {email}}, res) => {
    findUserByEmail(email, res);
});

/**
 * @swagger
 * /user:
 *     get:
 *         tags:
 *             - Users
 *         description: Returns a user based on the bearer token
 *         produces:
 *             - application/json
 *         parameters:
 *             - name: Authorization
 *               description: The bearer token
 *               in: header
 *               required: true
 *               type: string
 *         responses:
 *             200:
 *                 description: The user associated to the token
 *                 schema:
 *                     $ref: '#/definitions/User'
 *             401:
 *                 description: Security token is invalid
 *             404:
 *                 description: No user associated to the specified token
 *             500:
 *                 description: Unexpected error occurred
 */
router.get('/', authMiddleware, async ({user: {email}}, res) => {
    findUserByEmail(email, res);
});

/**
 * @swagger
 * /user:
 *     post:
 *         tags:
 *             - Users
 *         description: Creates a new user based on the provided bearer token
 *         produces:
 *             - application/json
 *         parameters:
 *             - name: Authorization
 *               description: The bearer token
 *               in: header
 *               required: true
 *               type: string
 *         responses:
 *             201:
 *                 description: User is created successfully
 *                 schema:
 *                     $ref: '#/definitions/User'
 *             400:
 *                 description: User already exists
 *             401:
 *                 description: Security token is invalid
 *             500:
 *                 description: Unexpected error occurred
 */
router.post('/', authMiddleware, async ({user: {email, firstName, lastName}}, res) => {
    logger.info(`POST /user - creating new user where email = ${email}`);

    try {
        const existingUser = await dao.findUserByEmail(email);
        if (existingUser) {
            logger.info(`POST /user - user already exists where email = ${email}`);
            return res.sendStatus(HttpStatus.BAD_REQUEST);
        }

        const newUser = await dao.createUser({email, firstName, lastName});

        logger.info(`POST /user - user created successfully where email = ${email}`);
        res.status(HttpStatus.CREATED).send(new UserDTO(newUser));
    } catch (e) {
        logger.error(`Error creating user where email = ${email}`);
        res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
});

module.exports = router;