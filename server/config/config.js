// =================
// Port   
// =================



process.env.PORT = process.env.PORT || 8080;

// =================
// Enviroment   
// =================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =================
// Database URI
// =================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffe';
    let marselo = 'conocelo';
} else {
    urlDB = 'mongodb+srv://PolarProjectDB:12112001lpse@cluster0.f3fik.mongodb.net/coffe';
}

process.env.URLDB = urlDB + ' marselo';