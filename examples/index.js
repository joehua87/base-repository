const config = require('./src/config');
require('mongoose').connect(config.db);

require('babel/register');
require('./src/app');
