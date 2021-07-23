const { ApiError, Client, Environment } = require('square');

const client = new Client({
	environment: process.env.ENV === 'prod' ? Environment.Production : Environment.Sandbox,
	accessToken: process.env.ENV === 'prod' ? process.env.SQUARE_TOKEN : process.env.SQUARE_TOKEN_PROD,
});

module.exports = { ApiError, client };