const jwt = require('jsonwebtoken');

const validateJWT = (req, res, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'Token must be send in the headers'
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_KEY);
    req.uid = uid;
    next();
  } catch (error) {

    return res.status(401).json({
      ok: false,
      msg: 'Token not valid'
    });
  }

  console.log(token);

}

module.exports = {
  validateJWT
}