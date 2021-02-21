require('./config/config');

const express = require('express');
const app = express();
const moongose = require('mongoose'); // require mongoose
let port = process.env.PORT;

var bodyParser = require('body-parser'); // To process the data from body

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); // Middleware

// parse application/json
app.use(bodyParser.json()); // Middleware

app.use(require('./routes/user')); // require for the routes of the app, GET, POST ETC

app.get('/', (req, res) => {
    res.json({
        env: process.env.URLDB
    })
})

moongose.connect('mongodb+srv://PolarProjectDB:12112001lpse@cluster0.f3fik.mongodb.net/coffe', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, res) => {
    if (err) throw err;

    console.log(`Database Ready`);

});

app.listen(port, () => {
    console.log(`listen in port: ${port}`);
})