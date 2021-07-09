const mongo = require('mongodb')
const { client } = require('./mongoClient')

const attachPersonToCode = async (personId, codeId) => {
	const database = client.db('fof');
	const codes = database.collection('codes');
	const updateDoc = {
		$set: {
			purchaser: personId
		},
	};
	const filter = {
		_id: mongo.ObjectID(codeId)
	}
	try {
		const result = await codes.updateOne(filter, updateDoc);
		return result;
	} catch (e) {
		throw new Error('mongo failed to attach the purchaser to the code they used')
	}
}


exports.attachPersonToCode = attachPersonToCode