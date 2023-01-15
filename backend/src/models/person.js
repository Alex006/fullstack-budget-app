const { pool } = require('../utils/oracle');
const oracledb = require('oracledb');

module.exports.register = ({ email, password, first_name, last_name }) => {
  const bindings = {
    email,
    password,
    first_name,
    last_name,
    person_token: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
  };
  const SQL_REGISTER_PERSON = `INSERT INTO PERSON(PERSON, EMAIL, PASSWORD, PERSON_TOKEN, FIRST_NAME, LAST_NAME)
                                VALUES(SQ_PERSON.NEXTVAL, :email, :password, API_TOKEN(TO_CHAR(SYSDATE, 'DD-MM-YYYY HH24:MI:SS') || :password), :first_name, :last_name)
                                RETURNING PERSON_TOKEN INTO :person_token`;
  return pool(SQL_REGISTER_PERSON, bindings, { autoCommit: true });
};

module.exports.hashpassword = ({ email }) => {
  const bindings = { email };
  const SQL_HASH_PASSWORD = `SELECT PASSWORD FROM PERSON WHERE EMAIL = :email`;
  return pool(SQL_HASH_PASSWORD, bindings);
};

module.exports.login = ({ email, password }) => {
  const bindings = {
    email,
    password,
    person_token: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
    first_name: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
    last_name: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
  };
  const SQL_LOGIN_PERSON = `UPDATE PERSON
                              SET
                                PERSON_TOKEN = API_TOKEN(TO_CHAR(SYSDATE, 'DD-MM-YYYY HH24:MI:SS') || :password),
                                MOD_DATE = SYSDATE
                              WHERE EMAIL = :email
                            RETURNING PERSON_TOKEN, FIRST_NAME, LAST_NAME INTO :person_token, :first_name, :last_name`;
  return pool(SQL_LOGIN_PERSON, bindings, { autoCommit: true });
};
