'use strict';

const indexController = require('../controllers/index');

module.exports = (server, app) => {

  const {
    fileHandling,
    checkFile
  } = indexController(app);

  // Sample route
  server.post('/', checkFile, fileHandling);
};