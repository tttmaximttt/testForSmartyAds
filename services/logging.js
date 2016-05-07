'use strict';

var fs      = require('fs'),
    path    = require('path'),
    colors  = require('colors'),
    winston = require('winston');


exports.createLogger = createLogger;


/*
 * configure and start logging
 * @param {Object} settings The configuration object for defining dir: log
 * directory, level: loglevel
 * @return the created logger instance
 */
function createLogger (settings) {

  var pkg = require(path.join(process.cwd(), 'package')),
      appName = pkg.name,
      appVersion = pkg.version,
      logDir = settings.dir || path.join(__dirname, 'logs'),
      logFile = path.join(logDir, appName + '-log.json'),
      logErrorFile = path.join(logDir, appName + '-errors.json'),
      logLevel = settings.level || (global.env === 'production' ? 'info' : 'debug');

  // Create log directory if it doesnt exist
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

  // Log to console and log file
  const logger = new winston.Logger;

  logger.add(winston.transports.Console, {
    colorize: true,
    timestamp: function() {
      let date = new Date();
      return date.getDate() + '/' + (date.getMonth() + 1) + ' ' + date.toTimeString().substr(0,5) + ' [' + global.process.pid + ']';
    },
    level: logLevel
  });

  logger.info('Starting ' + appName + ', version ' + appVersion);
  logger.info('Environment set to ' + process.env.NODE_ENV);
  logger.debug('Logging setup completed.');

  return logger;
}
