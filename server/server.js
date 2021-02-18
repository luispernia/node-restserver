require('./config/config');
const express = require('express');
const app = express();
let port = process.env.PORT;
var bodyParser = require('body-parser'); // To process the data from body

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })) // Middleware

// parse application/json
app.use(bodyParser.json()) // Middleware


app.get('/user', (req, res) => {
    res.json({
        type: 'get',
        message: 'Love U'
    })
})

app.post('/user', (req, res) => {

        let body = req.body; // Data from body (bodyParser)

        if (body.firstName === undefined) {
            res.status(400).json({ // sending a status code if something it's wrong or if something is missing
                ok: false,
                message: 'firstName is required'
            })
        } else {
            res.json({
                body
            })
        }
    })
    // Can recieve multi-params in one 

app.put('/user/:cat/:id', (req, res) => {

    // params value in URL
    let id = req.params.id;
    let cat = req.params.cat;

    res.json({
        message: 'Testing params in req',
        params: {
            id,
            cat
        }
    })
})

app.delete('/user', (req, res) => {
    res.json({
        type: 'delete',
        message: 'Love U'
    })
})

app.listen(port, () => {
    console.log(`listen in port: ${port}`);
})