const { client: square } = require('../square.js');
const { nanoid } = require('nanoid');

const createPayment = async (orderId, locationId, sourceId, verificationToken, ticketCount) => {
	const idempotencyKey = nanoid();
	const payment = {
		idempotencyKey,
		locationId: locationId,
		sourceId: sourceId,
		amountMoney: {
			amount: (process.env.TICKET_AMOUNT * ticketCount).toString(),
			currency: 'USD',
		},
		orderId: orderId
	};
	// VerificationDetails is part of Secure Card Authentication.
	// This part of the payload is highly recommended (and required for some countries)
	// for 'unauthenticated' payment methods like Cards.
	if (verificationToken) {
		payment.verificationToken = verificationToken;
	}
	try {
		const { result, statusCode } = await square.paymentsApi.createPayment(payment);
		return result;
	} catch (e) {
		console.log(e)
		throw new Error('square failed to create a new order')
	}
}

exports.createPayment = createPayment