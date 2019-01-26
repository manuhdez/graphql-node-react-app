const express = require('express');
const bodyParser = require('body-parser');
const graphQlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

// Parse requests
app.use(bodyParser.json());

// App routing
app.use('/graphql', graphQlHttp({
    schema: buildSchema(`
        type rootQuery {
            events: [String!]!
        }

        type rootMutation {
            createEvent(name: String): String
        }

        schema {
            query: rootQuery,
            mutation: rootMutation
        }
    `),
    rootValue: {
        events: () => ['Cooking', 'Sailing', 'Coding'],
        createEvent: (args) => {
            const eventName = args.name;
            return eventName;
        }
    },
    graphiql: true
}));

app.listen(3300);