const express = require('express');
const bodyParser = require('body-parser');
const graphQlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

// Mongoose models
const Event = require('./models/event');

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
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type rootQuery {
            events: [Event!]!
        }

        type rootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: rootQuery,
            mutation: rootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find()
                .then(events => (
                    events.map(event => ({ ...event._doc, _id: event.id}))
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
                date: new Date(date)
            });

            event.save()
                .then(res =>  ({ ...res._doc, _id: res.id }))
                .catch(err => console.log(err));

            return event;
        }
    },
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-cvt1i.mongodb.net/${process.env.DB_NAME}?retryWrites=true`,
    {useNewUrlParser: true})
    .then(() => app.listen(3300))
    .catch(err => console.log(err));

