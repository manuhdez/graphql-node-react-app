const Dataloader = require('dataloader');
const User = require('../../models/user');
const Event = require('../../models/event');
const { dateToString } = require('../../helpers/date');

const eventLoader = new Dataloader((eventIds) => events(eventIds));
const userLoder = new Dataloader((userIds) =>
  User.find({ _id: { $in: userIds } })
);

const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator)
  };
};

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
};

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    events.sort(
      (a, b) =>
        eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
    );
    return events.map((event) => transformEvent(event));
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await eventLoader.load(eventId);
    return event;
  } catch (err) {
    throw err;
  }
};

const user = async (userId) => {
  try {
    const user = await userLoder.load(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
