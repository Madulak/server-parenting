const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.postSignup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const userDoc = await User.findOne({username: username});
    if (userDoc) {
      console.log('[USER EXIST]')
    }

    if (!userDoc) {
      const hashPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        username: username,
        email: email,
        password: hashPassword,
      })

      const resultUser = await newUser.save();
      res.status(201).json({ message: 'User Created', user: resultUser})
    }

  } catch (e) {
    console.log('[ERROR 101] ',e);
  }
}

exports.postLogin = async (req, res, next) => {

  const { email, password } = req.body;

  try {
    const userDoc = await User.findOne({email: email});
    if (!userDoc) {
      console.log('[User NOt Found]')
    }

    if (userDoc) {
      const checkPassword = await bcrypt.compare(password, userDoc.password);
      if (!checkPassword) {
        console.log('[Wrong Password]');
      } else {

        const token = jwt.sign({
          userId: userDoc._id,
          username: userDoc.username,
          email: userDoc.email,
        }, 'somesupersecretsecret', {expiresIn: '24h'})

        res.status(200).json({token: token, user: userDoc,})
      }
    }

  } catch (err) {
    console.log('[ERROR 101] ', err);
  }
}
