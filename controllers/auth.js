//only used to authenticate
require('dotenv').config()

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js')
const SECRET = process.env.SECRET;


//hashing function////
const hash = (password) => {
  const levelOne= crypto.createHmac('sha256', process.env.SECRET)
              .update(password)
              .digest('hex')
              .split('')
              .reverse()
              .join('j')
  return crypto.createHmac('sha256', process.env.SECRET)
              .update(levelOne)
              .digest('hex')
              .split('')
              .reverse()
              .join('')
}
module.exports.hash = hash

//register users////
const registerService = async (req, res) => {
  console.log(req.body)
  const hashedPassword = hash(req.body.password)
  console.log('hashedPassword:', hashedPassword)
  req.body.password = bcrypt.hashSync(hashedPassword, bcrypt.genSaltSync(10))
  //opposite of the above line is below in login
  console.log(req.body)

  try{
    const createdUser = await User.create(req.body)
    const token = jwt.sign({
      username: createdUser.username
    }, SECRET)
    res.status(200).json({
      user: createdUser,
      token: token
    })
  }catch(error){
    console.error(error)
    res.status(400).json({msg: error.message})
  }
}

module.exports.register = registerService

//login user//

const loginService = async(req, res) => {
  //As a user I arrive at a form on the login page and I enter my username and password
  //we receive that data as a req.body and it looks like this:
  //req.body{username: String
  //password: String}
  //find the user by the username and once we find the user
  // we need to compare the req.body.password with the hashed and salted version of the pw
  //then let the front end know - notify the front end everything is good by sending a
  //token to the front end
  console.log(req.body)
  try{
    const foundUser = await User.findOne({ username: req.body.username })
    //will get back a user object and other googbly-guck
    req.body.password = hash(req.body.password)
    //almost there
    if (bcrypt.compareSync(req.body.password, foundUser.password)) {
      const token = jwt.sign({
        username: foundUser.username
      }, SECRET)
      res.status(200).json({ user: foundUser, token })
    }else{
      throw new Error('stay in your lane, that is not your password')
    }
    //this is the opposite of the code above - in the first position is the one we have only hashed, not salted
    //if the value is truthy, then send the token

  }catch(err){
    console.error(err)
    res.status(401).json({msg: err.message})
  }
}
module.exports.login = loginService


//verification function





//header authenticate

//json body authenticate
