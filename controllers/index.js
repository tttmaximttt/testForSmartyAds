'use strict';

const Promise = require('bluebird'),
	fs = require('fs'),
	path = require('path'),
	stat = Promise.promisify(fs.stat);



const indexController = (app) => {

	let filePath = path.format({
		dir: appDir + '/uploads',
		base: 'hello.txt'
	});

	const writeToFile = (body) => {

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

	const fileHandling = (req, res, next) => {
		let dir = path.dirname(filePath);

		return stat(dir)
			.then( () => {

				return writeToFile(req.body)

			}, () => {

				fs.mkdirSync(dir);
				return writeToFile(req.body)

			} )
			.then( () =>{
				return sendFile(res, next)
			}, (err) => {
				app.logger.error(err);
				return next(new restError.InternalServerError( err.message ));
			} )
	};

	const sendFile = (res, next) => {

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
	const checkFile = (req, res, next) => {

		return stat(filePath)
			.then( (data) => {

				app.logger.info(data);

				if (data && data.size === 0) return next();
				else return sendFile(res, next); //      <-------
				                                 // 		|        |
			}, () => {                         //     |        |
						                             //     |        |
				return next();                   //     |        ^ "если фаил не пустой зачитывает его содержимое и отвечает содержимым на POST запрос,
		                                     //     |        | а то что пришло в POST запросе записывает в фаил."
			} )                                //     |        | это мне показалось странным
			.then(() => {                      //     |        |
																				 //     |        |
				return writeToFile(req.body);    //      ------->

			}, (err) => {

				app.logger.error(err);
				return next(new restError.InternalServerError( err.message ));

			});

	};

	return {
		fileHandling,
		checkFile
	}
};

module.exports = indexController;