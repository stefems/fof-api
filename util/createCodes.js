const { createCode } = require('../util')

const createCodes = async () => {
	for (let i = 0; i < 8; i++) {
		const inserted = await createCode()
		console.log(inserted)
	}
}

exports.createCodes = createCodes