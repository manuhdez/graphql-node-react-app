const express = require('express');
const bodyParser = require('body-parser');
const graphQlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const app = express();

// Parse requests
app.use(bodyParser.json());

// App routing
app.use('/graphql', graphQlHttp({
  schema: graphQlSchema,
  rootValue: graphQlResolvers,
  graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-cvt1i.mongodb.net/${process.env.DB_NAME}?retryWrites=true`,
  { useNewUrlParser: true })
  .then(() => app.listen(3300))
  .catch(err => console.log(err));

