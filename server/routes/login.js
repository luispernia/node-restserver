const express = require("express");
const User = require("../models/user"); // Required the User Model with validations
const bcrypt = require("bcrypt"); // Compare the passwords in login
const jwt = require("jsonwebtoken"); // To create the Token

const { OAuth2Client } = require("google-auth-library"); // Google token verify
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express();

app.post("/login", (req, res) => {
  // Route for login

  let body = req.body;

  User.findOne(
    {
      email: body.email,
    },
    (err, userDB) => {
      // Take the user from db

      if (err) {
        return res.status(500).json({
          ok: false,
          message: {
            err,
          },
        });
      }

      if (!userDB) {
        // If the user exists
        return res.status(400).json({
          ok: false,
          message: "(User) or Password Incorrect",
        });
      }

      if (!bcrypt.compareSync(body.password, userDB.password)) {
        // If the password is the correct
        return res.status(400).json({
          ok: false,
          message: "User or (Password) Incorrect",
        });
      }

      let token = jwt.sign(
        {
          // First: Payload, Second: firm, Expire: ml, min, hr, d
          user: userDB,
        },
        process.env.TOKEN_SEED,
        {
          expiresIn: process.env.TOKEN_EXP,
        }
      );

      res.json({
        ok: true,
        user: userDB,
        token,
      });
    }
  );
});

// Google Configs

async function verify(token) {
  // Verify the token and the function returns the payload
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

  return {
    name: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
  };
}

app.post("/google", async (req, res) => {
  let token = req.body.idtoken;
  let googleUser = await verify(token).catch((e) => {
    // If the token isn't valid use catch
    return res.status(403).json({
      ok: false,
      err: e,
    });
  });

  User.findOne({ email: googleUser.email }, (err, userDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: {
          err,
        },
      });
    }

    if (userDB) {
      if (!googleUser.google) {
        // Not Signed as a google user
        return res.status(400).json({
          ok: false,
          err: {
            message: "The users need to use another authentication",
          },
        });
      } else {
        // Is signed as a google user and need a new token
        let token = jwt.sign(
          {
            // First: Payload, Second: firm, Expire: ml, min, hr, d
            user: userDB,
          },
          process.env.TOKEN_SEED,
          {
            expiresIn: process.env.TOKEN_EXP,
          }
        );

        res.json({
          ok: true,
          user: userDB,
          token,
        });
      }
    } else {
      // If the user doesn't exist
      let user = new User();
      user.name = googleUser.name;
      user.email = googleUser.email;
      user.img = googleUser.img;
      user.google = true;
      user.password = ":)";

      user.save((err, userDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }

        let token = jwt.sign(
          {
            // First: Payload, Second: firm, Expire: ml, min, hr, d
            user: userDB,
          },
          process.env.TOKEN_SEED,
          {
            expiresIn: process.env.TOKEN_EXP,
          }
        );

        res.json({
          ok: true,
          user: userDB,
          token,
        });
      });
    }
  });
});

module.exports = app;
