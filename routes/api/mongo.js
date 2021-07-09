const bodyParser = require('body-parser');
var express = require("express");
var router = express.Router();
// const generate = require('@nwlongnecker/adjective-adjective-animal');
const { getCode, client } = require('../../util');

router.get("/checkCode", async (req, res, next) => {
	try {
		const match = await getCode(req.query.code)
		if (match) {
			res.send(match);
		} else {
			res.status(404);
			res.send();
		}
	} catch (e) {
		console.log(e)
		res.status(500).send();
	}
});

router.get("/canPurchase", async (req, res, next) => {
	try {
		const match = await getCode(req.query.code)
		if (match && match.purchaser === '') {
			res.status(200)
			res.send({ message: 'can purchase' });
		} else {
			res.status(403);
			res.send();
		}
	} catch (e) {
		console.log(e)
		res.status(500).send();
	}
});

module.exports = router;