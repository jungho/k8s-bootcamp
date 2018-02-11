const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const logger = require('./logger');


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/swagger', require('./swagger'));
app.use('/api/user', require('./controller'));

module.exports = app;