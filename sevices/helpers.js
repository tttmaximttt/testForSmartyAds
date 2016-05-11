const fs = require('fs');

export const read = (filePath, res) => {

	let readStream = fs.createReadStream(filePath);

	readStream.pipe(res);

	readStream.on('error', (err) => {
		res.end(err.message)
	});

	return readStream
};

export const write = (filePath, item, res) => {

	let writeStream = fs.createWriteStream(filePath);

	writeStream.write(item);
	writeStream.end();

	writeStream.on('error', (err) => {
		res.end(err.message)
	});

	return writeStream
};
