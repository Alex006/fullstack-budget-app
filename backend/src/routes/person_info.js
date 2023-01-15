const express = require('express');
const router = express.Router();

const { infoPerson } = require('../controllers/person_info');

router.post('/person_info', infoPerson);

module.exports = router;
