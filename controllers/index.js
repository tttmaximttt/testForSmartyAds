'use strict';

const fs = require('fs'),
	path = require('path');

import {read, write} from '../sevices/helpers';

const indexController = () => {

	const filePath = path.format({
		dir: appDir + '/uploads',
		base: 'hello.txt'
	});

	const fileHandling = (req, res) => {
		let item  = ' ';

		req.on('data', (chunk) => {
			item += chunk
		});

		fs.stat(filePath, (err, data) => {

			if (err) {

				if ("ENOENT" === err.code) {
					fs.mkdir(path.dirname(filePath), (err) => {

						if (err) {

							res.statusCode = 500;
							res.end(err.message);

						} else {

							const stream = write(filePath, item, res);

							stream.on('close', () => {
								read(filePath, res);
							});

						}

					});

				} else {

					res.statusCode = 500;
					res.end(err.message);

				}

			} else {

				if (data && data.size === 0) {
					const stream = write(filePath, item, res);

					stream.on('close', () => {
						read(filePath, res);
					});

				} else {

					var stream = read(filePath, res);

					stream.on('close', () => {
						const stream = write(filePath, item, res);

						stream.on('close', () => {
							console.log('Item write after read')
						});

					});

				};

			}

		});

		req.on('end', () => {});

	};

	return {
		fileHandling
	}
};

module.exports = indexController;