// =================
// Port   
// =================



process.env.PORT = process.env.PORT || 8080;

// =================
// Enviroment   
// =================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; // Default as "production"

// =================
// Database URI
// =================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffe';
} else {
    urlDB = process.env.MONGO_URI; // From Heroku
}

process.env.URLDB = urlDB;