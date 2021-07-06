const { ApiError, client: square } = require('../../square.js');
const { createError, json, send } = require('micro');
const { nanoid } = require('nanoid');
const retry = require('async-retry');
const bodyParser = require('body-parser');
var express = require("express");
var router = express.Router();

router.post("/purchase", async (req, res, next) => {
	try {
		// if (!validatePaymentPayload(payload)) {
		// 	throw createError(400, 'Bad Request');
		// }
		const options = { retries: 3 }
		await retry(async (bail, attempt) => {
			try {
				// logger.debug('Creating payment', { attempt });
		
				const idempotencyKey = req.body.idempotencyKey || nanoid();
				const payment = {
					idempotencyKey,
					locationId: req.body.locationId,
					sourceId: req.body.sourceId,
					amountMoney: {
						amount: '25000',
						currency: 'USD',
					},
				};
		
				// VerificationDetails is part of Secure Card Authentication.
				// This part of the payload is highly recommended (and required for some countries)
				// for 'unauthenticated' payment methods like Cards.
				if (req.body.verificationToken) {
					payment.verificationToken = req.body.verificationToken;
				}
		
				const { result, statusCode } = await square.paymentsApi.createPayment(
					payment
				);
				// logger.info('Payment succeeded!', { result, statusCode });
				res.send({
					success: true,
					payment: {
						id: result.payment.id,
						status: result.payment.status,
						receiptUrl: result.payment.receiptUrl,
						orderId: result.payment.orderId,
					},
				});
			} catch (ex) {
				if (ex instanceof ApiError) {
					// likely an error in the request. don't retry
					// logger.error(ex.errors);
					bail(ex);
				} else {
					// IDEA: send to error reporting service
					// logger.error(`Error creating payment on attempt ${attempt}: ${ex}`);
					throw ex; // to attempt retry
				}
			}
		}, options);
	} catch (error) {
		// todo
		console.log(error)
		res.status(500).send({ success: false })
	}
});

module.exports = router;