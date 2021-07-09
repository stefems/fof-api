const { client } = require('./mongoClient')

const getCode = async (code) => {
	const database = client.db('fof');
	const codes = database.collection('codes');
	const query = { name: code };
	return await codes.findOne(query);
}


exports.getCode = getCode