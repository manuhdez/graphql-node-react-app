const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

module.exports = {
    users: async () => {
      try {
        const users = await User.find().populate('createdEvents')
        return users.map(user => ({ ...user._doc, password: null, _id: user.id }));
      } catch (err) {
        throw err;
      }
    },
    createUser: async args => {
      try {
        const { email, password } = args.userInput;
  
        // Check if email is already used
        const user = await User.findOne({ email });
  
        if (user) {
          throw new Error('Email already in use.');
        }
  
        const hashedPassword = await bcrypt.hash(password, 12);
        const createdUser = new User({
          email,
          password: hashedPassword
        });
  
        const res = await createdUser.save();
        return {
          ...res._doc,
          password: null,
          _id: res.id
        };
      } catch (err) {
        throw err;
      }
    },
    login: async ({email, password}) => {
      const user = await User.findOne({email});
      if (!user) throw new Error('User does not exist.');

      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) throw new Error('Incorrect password.');

      const token = jwt.sign({userId: user.id, email: user.email}, 'supersecretkey', { expiresIn: '1h' });

      return {
        userId: user.id,
        token,
        tokenExp: 1
      };
    }
  }