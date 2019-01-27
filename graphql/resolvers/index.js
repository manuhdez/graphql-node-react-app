const bcrypt = require('bcryptjs');
// Mongoose models
const Event = require('../../models/event');
const User = require('../../models/user');


const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } })
    return events.map(event => ({
      ...event._doc,
      _id: event.id,
      date: new Date(event._doc.date).toISOString(),
      creator: user.bind(this, event.creator)
    }));
  } catch (err) {
    throw err;
  }
}

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
}

module.exports = {
  events: async () => {
    try {
      const events = await Event.find().populate('creator')
      return events.map(event => ({
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event._doc.creator)
      }));
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args) => {
    try {
      const { title, description, price, date } = args.eventInput;

      const event = new Event({
        title,
        description,
        price,
        date: new Date(date),
        creator: "5c4dcbadbf683558411c1d43"
      });

      let createdEvent;
      const res = await event.save();

      createdEvent = {
        ...res._doc,
        _id: res.id,
        date: new Date(res._doc.date).toISOString(),
        creator: user.bind(this, res._doc.creator)
      };

      const creator = await User.findById('5c4dcbadbf683558411c1d43');
      if (!creator) {
        throw new Error('user not found');
      }
      creator.createdEvents.push(event);

      await creator.save();
      return createdEvent;
  } catch (err) {
    throw err;
  }
  },
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