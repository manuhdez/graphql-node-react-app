const express = require('express');
const bodyParser = require('body-parser');
const graphQlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const events = [];

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
        events: () => events,
        createEvent: (args) => {
            const { title, description, price, date } = args.eventInput;
            const event = {
                _id: Math.random().toString(),
                title,
                description,
                price,
                date
            }
            events.push(event);
            return event;
        }
    },
    graphiql: true
}));

app.listen(3300);