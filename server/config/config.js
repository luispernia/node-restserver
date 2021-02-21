// =================
// Port   
// =================



process.env.PORT = process.env.PORT || 8080;

// =================
// Enviroment   
// =================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =================
// Database URL
// =================

let urlDB;

if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/coffe';
} else {
    urlDB = 'mongodb+srv://PolarProjectDB:12112001lpse@cluster0.f3fik.mongodb.net/coffe';
}

process.env.URLDB = urlDB;