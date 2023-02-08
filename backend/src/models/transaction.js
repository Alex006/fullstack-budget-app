const { pool } = require('../utils/oracle');

module.exports.create = ({ person, debitAccount, creditAccount, description, accountNumber, amount, debitCurrency, creditCurrency }) => {
  const bindings = {person, debitAccount, creditAccount, description, accountNumber, amount, debitCurrency, creditCurrency };
  const SQL_INSERT_TRANSACTION = `INSERT INTO TRANSACTIONS(TXN_ID, DEBIT_ACCOUNT_ID, CREDIT_ACCOUNT_ID, PERSON,
                               DESCRIPTION, ACCOUNT_NUMBER, AMOUNT, DEBIT_CURRENCY, CREDIT_CURRENCY, ADD_DATE)
                              VALUES(SQ_TRANSACTIONS.NEXTVAL, :debitAccount, :creditAccount, :person,
                                :description, :accountNumber, :amount, :debitCurrency, :creditCurrency, SYSDATE)`;
  console.log(SQL_INSERT_TRANSACTION, bindings);
  return pool(SQL_INSERT_TRANSACTION, bindings, { autoCommit: true });
};

module.exports.findById = ({ person, transaction }) => {
  const bindings = { person, transaction };
  const SQL_SELECT_TRANSACTION = `SELECT                                 
                                DEBIT_ACCOUNT_ID AS "debitAccount",
                                CREDIT_ACCOUNT_ID AS "creditAccount",
                                ACCOUNT_NUMBER AS "name", 
                                DESCRIPTION AS "description", 
                                AMOUNT AS "amount",
                                DEBIT_CURRENCY AS "debitCurrency",
                                CREDIT_CURRENCY AS "creditCurrency" 
                              FROM TRANSACTIONS WHERE TXN_ID = :transaction AND PERSON = :person
                              ORDER BY TXN_ID ASC `;
  console.log(SQL_SELECT_TRANSACTIONS, bindings);
  return pool(SQL_SELECT_TRANSACTION, bindings);
};

module.exports.fetchAll = ({ person }) => {
  const bindings = { person };
  const SQL_SELECT_TRANSACTIONS = `SELECT 
                                    TXN_ID AS "txnId",
                                    DEBIT_ACCOUNT_ID AS "debitAccount",
                                    CREDIT_ACCOUNT_ID AS "creditAccount",
                                    ACCOUNT_NUMBER AS "accountNumber", 
                                    DESCRIPTION AS "description", 
                                    AMOUNT AS "amount",
                                    DEBIT_CURRENCY AS "debitCurrency",
                                    CREDIT_CURRENCY AS "creditCurrency"  
                                FROM TRANSACTIONS WHERE PERSON = :person
                                ORDER BY TXN_ID ASC `;

  console.log(SQL_SELECT_TRANSACTIONS, bindings);
  return pool(SQL_SELECT_TRANSACTIONS, bindings);
};

module.exports.fetchAllByBankAccountId = ({ person , bankAccountId }) => {
  const bindings = {person, bankAccountId };
  console.log("fetchAllByBankAccountId(). bindings=", bindings);
  const SQL_SELECT_TRANSACTIONS = `SELECT 
                                    TXN_ID AS "txnId",
                                    DEBIT_ACCOUNT_ID AS "debitAccount",
                                    CREDIT_ACCOUNT_ID AS "creditAccount",
                                    ACCOUNT_NUMBER AS "accountNumber", 
                                    DESCRIPTION AS "description", 
                                    AMOUNT AS "amount",
                                    DEBIT_CURRENCY AS "debitCurrency",
                                    CREDIT_CURRENCY AS "creditCurrency"  
                                FROM TRANSACTIONS WHERE PERSON = :person AND (DEBIT_ACCOUNT_ID = :bankAccountId OR CREDIT_ACCOUNT_ID = :bankAccountId)
                                ORDER BY TXN_ID ASC `;

  console.log(SQL_SELECT_TRANSACTIONS, bindings);
  return pool(SQL_SELECT_TRANSACTIONS, bindings);
};
