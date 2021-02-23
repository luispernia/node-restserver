const express = require('express');
const User = require('../models/user'); // Required the User Model with validations 
const bcrypt = require('bcrypt'); // Compare the passwords in login
const jwt = require('jsonwebtoken'); // To create the Token
const app = express();

app.post('/login', (req, res) => { // Route for login

    let body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => { // Take the user from db

        if (err) {
            return res.status(500).json({
                ok: false,
                message: {
                    err
                }
            })
        }

        if (!userDB) { // If the user exists
            return res.status(400).json({
                ok: false,
                message: "(User) or Password Incorrect"
            })
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) { // If the password is the correct
            return res.status(400).json({
                ok: false,
                message: "User or (Password) Incorrect"
            })
        }

        let token = jwt.sign({ // First: Payload, Second: firm, Expire: ml, min, hr, d
            user: userDB
        }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXP });

        res.json({
            ok: true,
            user: userDB,
            token
        })

    })

})



module.exports = app;