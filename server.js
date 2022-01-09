const express = require('express');
const session = require("express-session");

const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const PORT = process.env.PORT || 3334;

const errorHandler = require('./Utils/errorHandler');

const app = express();
app.disable("x-powered-by");
app.use(cors({ origin: '*' }));
///
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

//calling MongoDb//
const MongoDBConnection = require('./Database/connection');

app.get('/', (req, res) => {
    res.send('Tast Done By Vikram Sinwal.');
});

app.use(`/agency`, require('./Controllers/AgencyController')({ MongoDBConnection }));
app.use(`/client`, require('./Controllers/ClientController')({ MongoDBConnection }));

app.use((req, res, next) => {
    const err = new Error('Not Fount');
    err.status = 404;
    next(err);
})
app.use(errorHandler);

var server = http.createServer(app);

server.listen(PORT, () => {
    console.log("Server started at ", process.env.LOCALURL + PORT);
});