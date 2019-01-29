const Event = require('../../models/event');
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
  
        createdEvent = transformEvent(event);
  
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
    }
  }