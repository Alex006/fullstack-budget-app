const { pool } = require('../utils/oracle');

module.exports.create = ({ person, name, description }) => {
  const bindings = { person, name, description };
  const SQL_INSERT_CATEGORY = `INSERT INTO CATEGORY(CATEGORY, PERSON, NAME, DESCRIPTION)
                              VALUES(SQ_CATEGORY.NEXTVAL, :person, :name, :description)`;
  return pool(SQL_INSERT_CATEGORY, bindings, { autoCommit: true });
};

module.exports.findById = ({ person, category }) => {
  const bindings = { person, category };
  const SQL_SELECT_CATEGORY = `SELECT 
                                CATEGORY AS "category", 
                                NAME AS "name", 
                                DESCRIPTION AS "description" 
                              FROM CATEGORY WHERE CATEGORY = :category AND PERSON = :person`;
  return pool(SQL_SELECT_CATEGORY, bindings);
};

module.exports.fetchAll = ({ person }) => {
  const bindings = { person };
  const SQL_SELECT_CATEGORIES = `SELECT 
                                  CATEGORY AS "category", 
                                  NAME AS "name", 
                                  DESCRIPTION AS "description" 
                                FROM CATEGORY WHERE PERSON = :person`;
  return pool(SQL_SELECT_CATEGORIES, bindings);
};
