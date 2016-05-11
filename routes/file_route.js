'use strict';

const indexController = require('../controllers/index');

module.exports = (req, res) => {

  const {
    fileHandling
  } = indexController();

  switch (req.method) {
    case 'POST':
      fileHandling(req, res);
      break;
    default :
      res.statusCode = 500;
      res.end('Method not allowed')
  }

};