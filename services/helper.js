const 	_ = require('lodash'),
	moment = require('moment'),
	Promise = require('bluebird');

const lastNameParser = (lastName, range) => {

	if (lastName.length < 5){

		const randInt = Math.floor((Math.random() * range));
		lastName += randInt;

		return lastNameParser(lastName, range*100)

	} else if (5 <= lastName.length &&  lastName.length <= 8) {

		return lastName

	} else if (lastName.length > 8) {

		return lastName.slice(0, 8)

	}

};

const lastNameParserNoReq = (lastName) => {

	let range = 100;

	if (lastName.length < 5){

		const pow = 5 - lastName.length,
		randInt = Math.floor((Math.random() * Math.pow(range, pow)));
		lastName += randInt;

		return lastName

	} else if (5 <= lastName.length &&  lastName.length <= 8) {

		return lastName

	} else if (lastName.length > 8) {

		return lastName.slice(0, 8)

	}

};

const uniqueCheck = (generatedName) => {
	return new Promise(( resolve, reject ) => {

		 resolve(generatedName);

	});
};

const rangeAlphaGenerator = (start,stop) => {
	let result=[];

	for (let idx=start.charCodeAt(0),end=stop.charCodeAt(0); idx <=end; ++idx){
		result.push(String.fromCharCode(idx));
	}

	return result;
};

const userNameGenerator = (generatorObj) => {

	const alphabet = rangeAlphaGenerator('a','z'),
		firstName = generatorObj.firstName || _.sample(alphabet),
		lastName = generatorObj.lastName || _.sample(alphabet),
		dob = generatorObj.dob,
		email = generatorObj.email,
		dobGen = Number(moment(new Date(dob || Date.now())).format('DD'));

	let genStr = `${firstName.charAt(0).toLowerCase()}${lastNameParserNoReq(lastName).toLowerCase()}${dobGen}`;

	if (email) return Promise.resolve(email);
	else return uniqueCheck(genStr);//return promise

};

const passwordGenerator = (genStr) => {

};

module.exports = {
	userNameGenerator
};