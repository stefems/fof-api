var router = require('express').Router();

router.use('/square', require('./square'));
router.use('/mongo', require('./mongo'));

module.exports = router;