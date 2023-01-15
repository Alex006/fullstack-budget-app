const Guard = require('../models/guard');

const guard = async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) {
    return res.status(403).json({
      message: 'Unauthorized',
    });
  }
  const person_token = req.headers.authorization.split('Bearer ')[1];
  try {
    const args = { person_token };
    const { rows } = await Guard.verifyPersonToken(args);
    if (rows.length > 0) {
      req.person = rows[0];
      return next();
    }
  } catch (error) {
    console.log(error);
  }
  return res.status(403).json({
    message: 'Unauthorized',
  });
};

module.exports = guard;
