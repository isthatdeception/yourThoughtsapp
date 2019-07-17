// jshint esversion:9
// jshint multistr:true
require('dotenv').config()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');


const User = require('../../models/User');
const { validateRegisterInput, validateLoginInput } = require('../../util/validator')


// function that will be global for issuing a token
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
    process.env.SECRET_KEY,
    { expiresIn: '1h'}
    );
}

module.exports = {
  Mutation : {

    async login(_, {username, password}){
      const {errors, valid} = validateLoginInput(username, password);
      const user = await User.findOne({username});

      if (!user){
        errors.general = 'User not found';
        throw new UserInputError('User not found', {errors});
      }

      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        errors.general = 'Bad credentials';
        throw new UserInputError('Bad credentials', {errors});
      }

      // if the upper part doesnot execute it means the user had successfully login
      // issuing a token

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      }; 
    },

    async register(_,
      {
        registerInput: {username, email, password, confirmPassword}
      }, 
      context,
      info
      ) {
      /**
       * validate user data
       * and will make sure that it doesnot already exists
       * hash the password and create an auth token
       */


       // validate user data
       const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
       if (!valid){
         throw new UserInputError('Errors', { errors });
       }

       // make sure that user doesn't already exists
        const user = await User.findOne({ username});
        if (user) {
          throw new UserInputError('Username is taken',{
            errors: {
              username: 'this username is taken'
            }
          });
        }

       // hashed the password
        password = await bcrypt.hash(password, 12);

        const newUser = new User({
          email,
          username,
          password,
          createdAt: new Date().toISOString()
        });

        const res = await newUser.save();

        // auth token
        const token = generateToken(res);

        return {
          ...res._doc,
          id: res._id,
          token
        }; 

    }
  }
};
       
    
