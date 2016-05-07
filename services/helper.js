const Promise = require('bluebird'),
	fs = require('fs');

const writeToFile = (filePath, body) => {

	return new Promise( (resolve, reject) => {

		let writeStream = fs.createWriteStream(filePath);

		writeStream.write(body);
		writeStream.end();

		writeStream.on('close', () => {
			resolve()
		});

		writeStream.on('error', (err) => {
			reject()
		});

	} );

};

const sendFile = (filePath, res, next) => {

	return new Promise( (resolve, reject) => {

		let readStream = fs.createReadStream(filePath);

		readStream.on('open',  () => {

			readStream.pipe(res);
			resolve()

		});

		readStream.on('error', (err) => {

			app.logger.error(err);
			next(new restError.InternalServerError( err.message ));
			reject(err)
		});

	} );

};

module.exports = {
	writeToFile,
	sendFile
};