const mongoose = require('mongoose');

const {mongoDbUrl} = require('../config');
const logger = require('../logger');

const mongooseOptions = {
  useMongoClient: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 2000
};

mongoose.Promise = global.Promise;
const connectWithRetry = function() {
  return mongoose.connect(mongoDbUrl, mongooseOptions, function(err) {
    if (err) {
      logger.error('Failed to connect to mongo on startup - retrying in 2 sec', err);
      setTimeout(connectWithRetry, 2000);
    }
  });
};
connectWithRetry();

// const connection = mongoose.connection;
// connection.once('open', () => logger.info(`Connected successfully - ${mongoDbUrl}`));
// connection.on('error', () => {
//   logger.error(`Error connecting - ${mongoDbUrl}`);
// });

const User = require('./models/user')();

const createUser = async ({email, firstName, lastName}) => {
    return await new User({email, firstName, lastName}).save();
};

const findUserByEmail = async email => {
    return await User.findOne({email});
};

module.exports = {
    createUser,
    findUserByEmail
};
