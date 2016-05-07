'use strict';

const Promise = require('bluebird'),
	fs = require('fs'),
	path = require('path'),
	{writeToFile,sendFile} = require('../services/helper'),
	stat = Promise.promisify(fs.stat);


const indexController = (app) => {

	let filePath = path.format({
		dir: appDir + '/uploads',
		base: 'hello.txt'
	});

	const fileHandling = (req, res, next) => {
		let dir = path.dirname(filePath);

		return stat(dir)
			.then( () => {

				return writeToFile(filePath, req.body)

			}, () => {

				fs.mkdirSync(dir);
				return writeToFile(filePath, req.body)

			} )
			.then( () =>{
				return sendFile(filePath, res, next)
			}, (err) => {
				app.logger.error(err);
				return next(new restError.InternalServerError( err.message ));
			} )
	};

	const checkFile = (req, res, next) => {

		return stat(filePath)
			.then( (data) => {

				app.logger.info(data);

				if (data && data.size === 0) return next();
				else return sendFile(filePath, res, next); //      <-------
				                                           // 		|        |
			}, () => {                                   //     |        |
						                                       //     |        |
				return next();                             //     |        ^ "если фаил не пустой зачитывает его содержимое и отвечает содержимым на POST запрос,
		                                               //     |        | а то что пришло в POST запросе записывает в фаил."
			} )                                          //     |        | это мне показалось странным
			.then(() => {                                //     |        |
																				           //     |        |
				return writeToFile(filePath, req.body);    //      ------->

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