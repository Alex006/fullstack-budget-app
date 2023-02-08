const express = require('express');
const router = express.Router();

const {
  createAccount,
  getAccounts,
  getAccount,
} = require('../controllers/account');

router.post('/account', createAccount);

router.get('/account', getAccounts);

router.get('/account/:id', getAccount);

module.exports = router;

