// если возникнут вопросы почему я вынес это сюда и почему
// я возращаю не результат как выполнение функций, а стрим
// то у меня просто нету времени на то чтобы превести это тестовое к хорошему
// виду так что так :)

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
