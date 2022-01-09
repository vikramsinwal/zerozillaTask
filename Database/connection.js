const mongoose = require('mongoose');
let dbString = process.env.DATABASE;

const connections = mongoose.createConnection(dbString, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('debug', true);
connections.on('error', (err) => {
    console.log("Error while connection to Database", err);
})
connections.once('open', function callback() {
    console.log('Connected to Database');
});

var modelObject = require('./connectionModels')(connections);

module.exports = connections;