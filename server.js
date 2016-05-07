'use strict';

process.on('uncaughtException', (err) => {
  console.error(err);
  if (err && err.stack)
    console.error(err.stack);
});
const cluster   = require('cluster'),
      config    = require('config'),
      restify   = require('restify'),
      requireFu = require('require-fu'),
      restError = require('restify-errors'),
			dotenv 		= require('dotenv'),

      MyApp     = require('./app');

var bodyParser = require('body-parser');

// if process.env.NODE_ENV has not been set, default to development
const NODE_ENV = process.env.NODE_ENV || 'development';
global.env = NODE_ENV;
global.appDir = __dirname;
global.restError = restError;

try {
	dotenv.load({
		path: '.env.' + process.env.NODE_ENV,
		silent: true
	});
} catch (e0) {}

dotenv.load();
const app = new MyApp(config);
const logger = app.logger;

function serverRun () {

  // create servers
  const server = restify.createServer(app.name);

  server.pre(restify.pre.sanitizePath());

  server.use(restify.CORS({
    origins: config.get('cors.origins'),
    credentials: config.get('cors.credentials'),
    headers: config.get('cors.headers')
  }));

  server.use(restify.bodyParser());


  server.on('NotFound', (req, res, next) => {
    logger.debug('404', 'No route that matches request for ' + req.url);
    res.send(new restError.NotFoundError());
  });

  server.use((req, res, next) => {
    logger.info(`calling route - ${req.method} ${req.url}`);
    next();
  });

  // Error handling
  server.on('MethodNotAllowed', function (req, res, cb) {
    res.send(new restError.MethodNotAllowedError())
	});

  server.on('UnsupportedMediaType', function (request, response, cb) {});

  server.on('uncaughtException', function (request, response, route, error) {
    console.log(error, error.message)
  });

  // start listening
  const port = config.get('server.port') || 8000;
  server.listen(port, function () {
    logger.info(`${server.name} listening at ${server.url}`);
  });

  // add routes and controlers
  requireFu(__dirname + '/routes')(server, app);

  return server;
}

module.exports = serverRun();