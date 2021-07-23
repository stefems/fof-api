const { client: square } = require('../square.js');
const { nanoid } = require('nanoid');

const createOrder = async (locationId, ticketCount) => {
	const idempotencyKey = nanoid();
	const itemId = process.env.TICKET_ID;
	const order = {
		idempotencyKey: idempotencyKey,
		locationId: locationId,
		lineItems: [{
			quantity: ticketCount.toString(),
			catalogObjectId: itemId
		}]
	}
	try {
		const orderCreationResponse = await square.ordersApi.createOrder({ order: order })
		return orderCreationResponse.result.order.id
	} catch (e) {
		console.log(e)
		throw new Error('square failed to create a new order')
	}
}


exports.createOrder = createOrder