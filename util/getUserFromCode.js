const { getCode } = require('./getCode');
const { client } = require('./mongoClient')

const getUserFromCode = async (code) => {
	const match = await getCode(code);
	// if (!match) {

	// }
	// TODO NEEDS TO CHANGE A LOT
	const database = client.db('fof');
	const people = database.collection('people');
	
	const query = { code: code };
	return await people.findOne(query);
}

exports.getUserFromCode = getUserFromCode