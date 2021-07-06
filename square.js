const { ApiError, Client, Environment } = require('square');

const client = new Client({
	//process.env.ENV === 'prod' ? Environment.Production : 
	environment: Environment.Sandbox,
	accessToken: process.env.SQUARE_TOKEN,
});

module.exports = { ApiError, client };