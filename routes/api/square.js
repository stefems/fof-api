const { ApiError, client: square } = require('../../square.js');
const { createError, json, send } = require('micro');
const { nanoid } = require('nanoid');
const retry = require('async-retry');
const bodyParser = require('body-parser');
var express = require("express");
var router = express.Router();
var { createPerson, attachPersonToCode, getCode, createCode, sendEmail } = require('../../util')

router.post("/purchase", async (req, res, next) => {
	try {
		// if (!validatePaymentPayload(payload)) {
		// 	throw createError(400, 'Bad Request');
		// }
		const match = await getCode(req.body.code)
		if (!match || match.purchaser !== '') {
			// TODO TEST
			res.status(403).send({ message: 'code invalid or already used'});
		}
		const options = { retries: 3 }
		await retry(async (bail, attempt) => {
			try {
				// logger.debug('Creating payment', { attempt });
				console.log("ATTEMPTING")
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
				//createCode can
				//throw a code generation problem
				//throw a mongo problem
				const newCode = await createCode(req.body.person)
				req.body.person.codes = [newCode.insertedId]
				const newPerson = await createPerson(req.body.person)
				const codeAttachedReponse = await attachPersonToCode(newPerson.insertedId, match._id)
				// const emailResponse = await sendEmail(newPerson, newCode.name, payment)
				
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
				console.log(ex)
				if (ex instanceof ApiError) {
					console.log('api error')
					// likely an error in the request. don't retry
					// logger.error(ex.errors);
					bail(ex);
				} else {
					console.log('not api error')
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