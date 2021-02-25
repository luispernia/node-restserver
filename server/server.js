require('./config/config');

const express = require('express');
const app = express();
const moongose = require('mongoose'); // require mongoose
let path = require('path');
let port = process.env.PORT;

var bodyParser = require('body-parser'); // To process the data from body

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); // Middleware

// parse application/json
app.use(bodyParser.json()); // Middleware

// Routes Global Configuration
app.use(require('./routes/index'));

// Static View
app.use(express.static(path.resolve(__dirname, '../public'))); // path is for make the path clean, run clg in __dirname + '../public' for understand

moongose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, res) => {
    if (err) throw err;

    console.log(`Database Ready`);

});

app.listen(port, () => {
    console.log(`listen in port: ${port}`);
})