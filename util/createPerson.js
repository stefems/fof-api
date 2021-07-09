const { client } = require('./mongoClient')

const createPerson = async (person) => {
	const database = client.db('fof');
	const people  = database.collection('people');
	const newPerson = {
		name: person.firstName + ' ' + person.lastName,
		codes: person.codes,
		signedUp: new Date(),
		cardName: person.cardName,
		email: person.email,
		phone: person.phone,
	}
	try {
		const insertResponse = await people.insertOne(newPerson)
		return insertResponse;
	} catch (e) {
		throw new Error('mongo failed to create a new person')
	}
}


exports.createPerson = createPerson