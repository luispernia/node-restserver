// =================
// Port
// =================

process.env.PORT = process.env.PORT || 8080;

// =================
// Enviroment
// =================

process.env.NODE_ENV = process.env.NODE_ENV || "dev"; // Default as "production"

// =================
// Token Expired
// =================
process.env.TOKEN_EXP = 60 * 60 * 24 * 30;

// =================
// Seed Authentication
// =================
process.env.TOKEN_SEED = process.env.TOKEN_SEED || "this-is-the-seed-dev";

// =================
// Database URI
// =================

let urlDB;

if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost:27017/coffe";
} else {
  urlDB = process.env.MONGO_URI; // From Heroku
}

process.env.URLDB = urlDB;

// =================
// Google Client ID
// =================
process.env.CLIENT_ID =
  "1027404860731-94fdhle3qvr2qipn02g8rbn57u5ej7bj.apps.googleusercontent.com";
