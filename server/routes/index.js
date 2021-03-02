const express = require("express");
const app = express();

app.use(require("./user")); // require for the routes of the app, GET, POST ETC
app.use(require("./login"));
app.use(require("./category"));
app.use(require("./product"));

module.exports = app;
