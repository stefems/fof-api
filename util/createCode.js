const generate = require('@nwlongnecker/adjective-adjective-animal');
const retry = require('async-retry');
const { client } = require('./mongoClient')

const mushroomNames = [
	'oyster',
	'bay-bolete',
	'black-trumpet',
	'button',
	'caesar',
	'cauliflower',
	'chanterelle',
	'charcoal-burner',
	'chicken-of-the-woods',
	'common-ink-cap',
	'crab-brittlegill',
	'cremini',
	'dryads-saddle',
	'enoki',
	'false-morel'
];

const getName = async () => {
	let name = await generate(2)
	name += '-' + mushroomNames[Math.floor(Math.random() * mushroomNames.length)]
	return name
}

const createCode = async (person) => {
	const database = client.db('fof');
	const codes = database.collection('codes');
	const codeName = await retry(async () => {
		const name = await getName();
		const query = { name: name }
		const codeExistsAlready = await codes.findOne(query);
		if (codeExistsAlready) {
			throw new Error('code for attempted new code already exists')
		} else {
			return name
		}
	}, {
		retries: 5
	});
	const newCode = {
		name: codeName,
		purchaser: ''
	};
	try {
		const insertResponse = await codes.insertOne(newCode)
		return insertResponse;
	} catch (e) {
		throw new Error('mongo failed to create a new code')
	}
}


exports.createCode = createCode