var router = require('express').Router();

router.use('/mongo', require('./mongo'));

module.exports = router;