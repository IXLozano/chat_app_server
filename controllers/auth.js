// Controller - receive Request, Save User (Mongoose) and return Palyload

const { response } = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');



const login = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    // Find user in DB
    const userDB = await User.findOne({ email });

    // Return 404 if user doesn't exist
    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Email not found'
      });
    }

    // Validate Password
    const validPassword = bcrypt.compareSync(password, userDB.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Password is incorrect'
      });
    }

    // Generate JWT
    const token = await generateJWT(userDB.id)


    return res.json({
      ok: true,
      body: userDB,
      token
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      ok: false,
      msg: 'Internal Server Error'
    });
  }

}



const createUser = async (req, res = response) => {

  // Create User from payload request
  const user = new User(req.body);

  // Extract fields from User
  const { email, password } = user;

  try {
    const emailExist = await User.findOne({ email });

    if (emailExist) {
      return res.status(400).json({
        ok: false,
        msg: 'Email already exist'
      });
    }

    //Encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // Save user to DB
    await user.save();

    // Generate token
    const token = await generateJWT(user.id);

    // Return payload response
    res.json({
      ok: true,
      user,
      token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Internal Server Error'
    });
  }
}

const refreshToken = async (req, res = response) => {

  // Get uid
  const uid = req.uid;

  // generate new token
  const token = await generateJWT(uid);

  // Get user
  const user = await User.findById(uid);

  res.json({
    ok: true,
    user,
    token
  });
};



module.exports = {
  createUser,
  login,
  refreshToken

}