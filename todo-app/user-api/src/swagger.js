const router = require('express').Router();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'User API',
            version: '1.0.0',
            description: 'REST API for creating and retreiving users based on the provided security token'
        },
        tags: [{
            name: 'Users',
            description: 'Operations for the user resource'
        }],
        schemes: ['http', 'https'],
        host: 'localhost:8082',
        basePath: '/api'
    },
    apis: ['./src/controller.js', './src/dto.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
router.get('/json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;