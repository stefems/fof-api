var express = require("express");
var router = express.Router();
const generate = require('@nwlongnecker/adjective-adjective-animal');
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

client.connect();

router.get("/checkCode", async (req, res, next) => {
	try {
		const database = client.db('fof');
		const people = database.collection('people');
		const query = { code: req.query.code };
		const match = await people.findOne(query);
		if (match) {
			res.send(match);
		} else {
			res.status(404);
			res.send();
		}
	} catch (e) {
		console.log(e)
		res.send();
	}
});

router.get("/canPurchase", async (req, res, next) => {
	try {
		const database = client.db('fof');
		const people = database.collection('people');
		const query = { code: req.query.code };
		const match = await people.findOne(query);
		console.log(match)
		console.log(req.query.amount)
		//also add the check to ensure the purchaser hasn't already bought two
		if (match && match.nodes && match.nodes.length < match.inviteAmount) {
			res.status(200)
			res.send({ message: 'can purchase'});
		} else {
			res.status(403);
			res.send();
		}
	} catch (e) {
		console.log(e)
		res.send();
	}
});

module.exports = router;