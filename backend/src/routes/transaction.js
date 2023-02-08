const express = require('express');
const router = express.Router();

const {
  createTransaction,
  getTransactions,
  getTransaction,
  getTransactionsByAccountId,
} = require('../controllers/transaction');

router.post('/transaction', createTransaction);

router.get('/transaction', getTransactions);

router.get('/transaction/:id', getTransaction);

router.get('/transaction/bankAccount/:id', getTransactionsByAccountId);

module.exports = router;
