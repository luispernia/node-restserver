const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { verifyTokenImg } = require("../middlewares/authentication");

app.get("/image/:type/:img", verifyTokenImg, (req, res) => {
  let img = req.params.img;
  let type = req.params.type;
  let noPath = path.resolve(__dirname, `../assets/no-image.jpg`);
  let imgPath = path.resolve(__dirname, `../../uploads/${type}/${img}`);
  if (!fs.existsSync(imgPath)) {
    return res.sendFile(noPath);
  }
  res.sendFile(imgPath);
});

module.exports = app;
