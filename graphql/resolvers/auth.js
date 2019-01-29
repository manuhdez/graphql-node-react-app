const bcrypt = require('bcryptjs');
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
    }
  }