const express = require('express');
const bodyParser = require('body-parser');
const graphQlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Mongoose models
const Event = require('./models/event');
const User = require('./models/user');

const app = express();

// Parse requests
app.use(bodyParser.json());

// App routing
app.use('/graphql', graphQlHttp({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
      creator: User!
    }

    type User {
      _id: ID!
      email: String!
      password: String
      createdEvents: [Event!]
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
      creator: ID!
    }

    input UserInput {
      email: String!
      password: String!
    }

    type rootQuery {
      events: [Event!]!
      users: [User!]!
    }

    type rootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
    }

    schema {
      query: rootQuery,
      mutation: rootMutation
    }
    `),
  rootValue: {
    events: () => {
      return Event.find().populate('creator')
        .then(events => (
          events.map(event => ({ ...event._doc, _id: event.id }))
        ))
        .catch(err => {
          throw err;
        });
    },
    createEvent: (args) => {
      const { title, description, price, date } = args.eventInput;

      const event = new Event({
        title,
        description,
        price,
        date: new Date(date),
        creator: "5c4dcbadbf683558411c1d43"
      });

      let createdEvent;

      return event.save()
        .then(res => {
          createdEvent = {...res._doc, _id: res.id};
          return User.findById('5c4dcbadbf683558411c1d43')
        })
        .then(user => {
          if (!user) {
            throw new Error('user not found');
          }
          user.createdEvents.push(event);
          return user.save();
        })
        .then(() => createdEvent)
        .catch(err => {
          throw err;
        });

      return event;
    },
    users: () => {
      return User.find().populate('createdEvents')
        .then(users => users.map(user => ({ ...user._doc, password: null, _id: user.id})))
        .catch(err => {
          throw err;
        });
    },
    createUser: args => {
      const { email, password } = args.userInput;

      // Check if email is already used
      return User.findOne({email})
        .then(user => {
          if (user) {
            throw new Error('Email already in use.');
          }
          return bcrypt.hash(password, 12)
        })
        .then(hashedPass => {
          const user = new User({
            email,
            password: hashedPass
          });
          return user.save();
        })
        .then(res => ({...res._doc, password: null, _id: res.id}))
        .catch(err => {
          throw err;
        });
    }
  },
  graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-cvt1i.mongodb.net/${process.env.DB_NAME}?retryWrites=true`,
  { useNewUrlParser: true })
  .then(() => app.listen(3300))
  .catch(err => console.log(err));

