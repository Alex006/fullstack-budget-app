module.exports.infoPerson = (req, res, next) => {
  res.status(200).json({
    message: 'success',
    data: [
      {
        first_name: req.person.first_name,
        last_name: req.person.last_name,
      },
    ],
  });
};
