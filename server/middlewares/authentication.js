let jwt = require("jsonwebtoken");

// =========
// Veriry Token
// =========

let verifyToken = (req, res, next) => {
  // Midleware
  let token = req.get("Authorization"); // req.get() for get headers params
  jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
    // Verify the token, token, seed, decoded
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Not Valid Token",
        },
      });
    }

    req.user = decoded.user;
    next(); // continue with the execution of the code in a specific route
  });
};
let verifyRole = (req, res, next) => {
  // Midleware

  let user = req.user;
  if (user.role != "ADMIN_ROLE") {
    return res.json({
      ok: false,
      err: {
        message: "The user is not ADMINISTRATOR",
      },
    });
  }

  next();
};

module.exports = {
  verifyToken,
  verifyRole,
};
