const express = require('express');
const User = require('../models/user'); // Required the User Model with validations 
const bcrypt = require('bcrypt');
const _ = require('underscore');
const user = require('../models/user');
const app = express();

app.get('/user', (req, res) => { // Routes

    let from = req.query.from || 0;
    let limit = req.query.limit || 5;
    from = Number(from);
    limit = Number(limit);

    User.find({ status: true }, 'name email img role status google') // Filter in all the databse, the second parameter is for show the values we want to show
        .skip(from) // From wich element of the database start
        .limit(limit) // Limit of articles to show in one page
        .exec((err, users) => { // Execute the commad (MongoDB)
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            User.count({ status: true }, (err, count) => { // Show the count registers
                res.json({
                    ok: true,
                    users,
                    count
                })
            })
        })
})

app.post('/user', (req, res) => {

        let body = req.body; // Data from body (bodyParser)
        let user = new User({ // Params for the User Model
            name: body.name,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            role: body.role
        });

        user.save((err, userDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                user: userDB
            })


        })
    })
    // Can recieve multi-params in one 

app.put('/user/:id', (req, res) => {
    // params value in URL
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: userDB
        })
    })

})

app.delete('/user/:id', (req, res) => {

    let id = req.params.id;
    let state = { status: false }

    User.findByIdAndUpdate(id, state, { new: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!userDB) {
            res.status(400).json({
                ok: false,
                error: {
                    message: 'User not found'
                }
            })
        }

        res.json({
            ok: true,
            user: userDB
        })
    })

    /* // Physical Deleting
        User.findByIdAndRemove(id, (err, userDeleted) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            if (!userDeleted) {
                return res.status(400).json({
                    ok: false,
                    message: 'User not found'
                })
            }


            res.json({
                ok: true,
                userDeleted
            })
        })
    */
})

module.exports = app;