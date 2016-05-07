'use strict';

var path    = require('path'),
    logging = require('./services/logging');

class MyApp {
  constructor(config) {
    this.settings   = config.get('app'); // Private property
    this.name       = config.get('app.name') || require(path.join(process.cwd(), 'package')).name;
    this.logger     = logging.createLogger(config.get('logging'));
  }
}

module.exports = MyApp;
