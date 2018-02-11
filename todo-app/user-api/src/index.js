const app = require('./app');

const logger = require('./logger');


const PORT = process.env.PORT || 8082;
app.listen(PORT, () => logger.info(`Listening to port ${PORT}`));