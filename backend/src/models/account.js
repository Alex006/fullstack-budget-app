const { pool } = require('../utils/oracle');

module.exports.create = ({ account_id, person, name, bank_name, account_balance, currency_id }) => {
    const bindings = { account_id, person, name, bank_name, account_balance, currency_id };
    const SQL_INSERT_ACCOUNT = `INSERT INTO ACCOUNT(ACCOUNT_ID, PERSON, NAME, BANK_NAME, ACCOUNT_BALANCE, CURRENCY_ID)
                                VALUES(:account_id, :person, :name, :bank_name, :account_balance, :currency_id)`;
    return pool(SQL_INSERT_ACCOUNT, bindings, { autoCommit: true });
  };


  module.exports.findById = ({ person, account_id }) => {
    const bindings = { person, account_id };
    const SQL_SELECT_ACCOUNT = `SELECT 
                                  ACCOUNT_ID AS "account_id", 
                                  NAME AS "name", 
                                  BANK_NAME AS "bank_name", 
                                  ACCOUNT_BALANCE AS "account_balance", 
                                  CURRENCY_ID AS "currency_id"
                                FROM ACCOUNT WHERE ACCOUNT_ID = :account_id AND PERSON = :person`;
    return pool(SQL_SELECT_ACCOUNT, bindings);
  };


  module.exports.fetchAll = ({ person }) => {
    const bindings = { person };
    const SQL_SELECT_ACCOUNT = `SELECT 
                                    ACCOUNT_ID AS "account_id", 
                                    NAME AS "name", 
                                    BANK_NAME AS "bank_name", 
                                    ACCOUNT_BALANCE AS "account_balance", 
                                    CURRENCY_ID AS "currency_id"
                                  FROM ACCOUNT WHERE PERSON = :person`;
    return pool(SQL_SELECT_ACCOUNT, bindings);
  };

