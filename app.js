const express = require('express');
const bodyParser = require('body-parser');
const graphQlHttp = require('express-graphql');
const mongoose = require('mongoose');

// custom middleware functions
const isAuth = require('./middleware/is-auth');

// graphql
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(isAuth);

// App routing
app.use('/graphql', graphQlHttp({
  schema: graphQlSchema,
  rootValue: graphQlResolvers,
  graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-cvt1i.mongodb.net/${process.env.DB_NAME}?retryWrites=true`,
  { useNewUrlParser: true })
  .then(() => app.listen(3300, () => console.log(`server running on http://localhost:${3300}`)))
  .catch(err => console.log(err));

