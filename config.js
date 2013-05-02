var config = {
  development: {
    mongodb: {
      url: 'mongodb://127.0.0.1:27017/listenr'
    }
  },
  production: {
    mongodb: {
      url: process.env.MONGOHQ_URL
    }
  }
};

var environment = process.env.NODE_ENV || 'development';

module.exports = config[environment];
