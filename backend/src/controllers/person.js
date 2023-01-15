const Person = require('../models/person');
const bcrypt = require('bcryptjs');

module.exports.registerPerson = async (req, res, next) => {
  const args = {
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    first_name: req.body.first_name,
    last_name: req.body.last_name,
  };
  try {
    const { outBinds } = await Person.register(args);
    const { person_token } = outBinds;
    res
      .status(200)
      .cookie('auth_token', person_token[0], {
        sameSite: 'none',
        secure: true,
        expires: new Date(2147483647 * 1000),
      })
      .json({
        messsage: 'Person was registered successfully!',
        data: [
          {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            auth_token: person_token[0],
          },
        ],
      });
  } catch (error) {
    res
      .status(400)
      .clearCookie('auth_token', { sameSite: 'none', secure: true })
      .json({ messsage: error });
  }
};

module.exports.loginPerson = async (req, res, next) => {
  let args = {
    email: req.body.email,
    password: req.body.password,
  };
  try {
    const { rows: hashpasswordrow } = await Person.hashpassword(args);
    if (hashpasswordrow.length > 0) {
      const hashpassword = hashpasswordrow[0]['PASSWORD'];
      if (bcrypt.compareSync(args.password, hashpassword)) {
        args = { email: args.email, password: hashpassword };
        const { outBinds } = await Person.login(args);
        const { person_token, first_name, last_name } = outBinds;
        return res
          .status(200)
          .cookie('auth_token', person_token[0], {
            sameSite: 'none',
            secure: true,
            expires: new Date(2147483647 * 1000),
          })
          .json({
            messsage: 'Login Successfully',
            data: [
              {
                first_name: first_name[0],
                last_name: last_name[0],
                auth_token: person_token[0],
              },
            ],
          });
      }
    }
    res
      .status(403)
      .clearCookie('auth_token', { sameSite: 'none', secure: true })
      .json({ messsage: 'Invalid credentials' });
  } catch (error) {
    res
      .status(400)
      .clearCookie('auth_token', { sameSite: 'none', secure: true })
      .json({ messsage: error });
  }
};
