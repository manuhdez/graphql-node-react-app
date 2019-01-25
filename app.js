const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Parse requests
app.use(bodyParser.json());

// App routing
app.get('/', (req, res, next) => {
    res.send('Hello world!');
});

app.listen(3300);