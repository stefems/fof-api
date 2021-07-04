var express = require("express");
var router = express.Router();
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

router.get("/checkCode", async (req, res, next) => {
	try {
		await client.connect();
		const database = client.db('fof');
		const people = database.collection('people');
		const query = { code: req.query.code };
		const match = await people.findOne(query);
		res.send(match);
	} catch (e) {
		console.log(e)
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
});

module.exports = router;