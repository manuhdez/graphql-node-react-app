const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');



module.exports = {
    events: async () => {
      try {
        const events = await Event.find().populate('creator')
        return events.map(event => transformEvent(event));
      } catch (err) {
        throw err;
      }
    },
    createEvent: async (args, req) => {
      if (!req.isAuth) throw new Error('User not logged in.');

      try {
        const { title, description, price, date } = args.eventInput;
  
        const event = new Event({
          title,
          description,
          price,
          date: new Date(date),
          creator: req.userId
        });
  
        let createdEvent;
        const res = await event.save();
  
        createdEvent = transformEvent(event);
  
        const creator = await User.findById(req.userId);
        if (!creator) {
          throw new Error('user not found');
        }
        creator.createdEvents.push(event);
  
        await creator.save();
        return createdEvent;
    } catch (err) {
      throw err;
    }
    }
  }