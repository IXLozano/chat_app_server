//path: api/login

const { Router, response } = require('express');
const { check } = require('express-validator');

// Controller - receive Request, Save User (Mongoose) and return Palyload
const { createUser, login, renewToken, refreshToken } = require('../controllers/auth');
// 
const { validateFields } = require('../middlewares/validate-api-fileds');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.post(
  '/new',
  [
    check('name', 'Name field is mandatory').not().isEmpty(),
    check('email', 'Email field is mandatory').isEmail(),
    check('password', 'Password field is mandatory').not().isEmpty(),
    validateFields
  ],
  createUser
);

router.post(
  '/',
  [
    check('email', 'Name field is mandatory').isEmail(),
    check('password', 'Password field is mandatory').not().isEmpty()
  ],
  login
);

router.get('/refresh', validateJWT, refreshToken);



module.exports = router;