'use strict';

const cluster   = require('cluster'),
	fileRoute = require('./routes/file_route'),
	http = require('http');

global.appDir = __dirname;

const server = http.createServer((req, res) => {

  switch (req.url){
	  case '/file':
		  fileRoute(req, res);
		  break;
	  default :
		  res.statusCode = 404;
		  res.end('Not found')
  }

});

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(4000, () => {
    console.log('server start at port 4000')
});
