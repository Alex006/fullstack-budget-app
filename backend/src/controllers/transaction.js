const Transaction = require('../models/transaction');

module.exports.createTransaction = async (req, res, next) => {
  const args = {
    person: req.person.person,
    //name: req.body.name,
    //description: req.body.description,

    debitAccount: req.body.debitAccount,
    creditAccount: req.body.creditAccount,
    description: req.body.description,
    accountNumber: req.body.accountNumber,
    amount: req.body.amount,
    debitCurrency: req.body.debitCurrency,
    creditCurrency: req.body.creditCurrency,
  };
  try {
    await Transaction.create(args);
    res.status(200).json({ messsage: 'Transaction created successfully!' });
  } catch (error) {
    res.status(400).json({ messsage: error });
  }
};

module.exports.getTransaction = async (req, res, next) => {
  const args = { person: req.person.person, transaction: Number(req.params.id) };
  try {
    const { rows } = await Transaction.findById(args);
    res.status(200).json({ data: rows });
  } catch (error) {
    res.status(400).json({ messsage: error });
  }
};

module.exports.getTransactions = async (req, res, next) => {
  const args = { person: req.person.person };
  try {
    const { rows } = await Transaction.fetchAll(args);
    res.status(200).json({ data: rows });
  } catch (error) {
    res.status(400).json({ messsage: error });
  }
};

module.exports.getTransactionsByAccountId = async (req, res, next) => {
  const args = { person: req.person.person, bankAccountId: Number(req.params.id) };
  try {
    console.log("BACKEND>>>> getTransactionsByAccountId()", args)
    const { rows } = await Transaction.fetchAllByBankAccountId(args);
    console.log("BACKEND>>>> rows=", rows)
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error("BACKEND>>>> error getTransactionsByAccountId =", error)
    res.status(400).json({ messsage: error });
  }
};


