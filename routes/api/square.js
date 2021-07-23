const { ApiError, client: square } = require('../../square.js');
const { createError, json, send } = require('micro');
const { nanoid } = require('nanoid');
const retry = require('async-retry');
const bodyParser = require('body-parser');
var express = require("express");
var router = express.Router();
var { createOrder, createPayment, createPerson, attachPersonToCode, getCode, createCode, sendEmail } = require('../../util')

router.post("/purchase", async (req, res, next) => {
	try {
		const match = await getCode(req.body.code)
		if (!match || match.purchaser !== '') {
			// TODO TEST
			res.status(403).send({ message: 'code invalid or already used'});
		}
		const orderCreationResponseId = await createOrder(req.body.locationId, req.body.ticketCount)
		const paymentCreationResponse = await createPayment(orderCreationResponseId, req.body.locationId, req.body.sourceId, req.body.verificationToken, req.body.ticketCount)
		const newCode = await createCode(req.body.person)
		req.body.person.codes = [newCode.insertedId]
		const newPerson = await createPerson(req.body.person)
		const codeAttachedReponse = await attachPersonToCode(newPerson.insertedId, match._id)
		// const emailResponse = await sendEmail(newPerson, newCode.name, payment)
		res.status(201).send({ message: 'ok' })
	} catch (error) {
		// todo
		console.log(error)
		res.status(500).send({ error: error })
	}
});

module.exports = router;