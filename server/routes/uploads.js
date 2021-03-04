const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const User = require("../models/user");
const Product = require("../models/product");

// Default Options
app.use(fileUpload());

app.put("/upload/:type/:id", (req, res) => {
  let type = req.params.type; // Type of file, User or Product
  let id = req.params.id;

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "Not Files Found",
      },
    });
  }

  // Type Validator
  let validTypes = ["products", "users"];

  if (validTypes.indexOf(type) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `Type Not Valid, The Valid Types Are: (${validTypes})`,
      },
    });
  }

  let photo = req.files.photo;

  let validExt = ["png", "jpg", "gif", "jpeg"]; // Valid Extensions
  let extension = photo.name.split(".")[1];

  if (validExt.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `Extension Not Valid, The Valid Extensions are ${validExt}`,
      },
    });
  }
  // Change the name of file
  let fileName = `${id}-${new Date().getMilliseconds()}.${extension}`; // Generate a Unique File Name

  photo.mv(`uploads/${type}/${fileName}`, (err) => {
    // Move the file in a specific path
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    if (type === "users") {
      userImage(id, res, fileName, type);
    } else if (type === "products") {
      productsImage(id, res, fileName, type);
    } else {
      return res.status(400).json({
        ok: false,
        err: {
          message: `Not Valid Type, Valid types are: ${validTypes}`,
        },
      });
    }
  });
});

function userImage(id, res, filename, type) {
  User.findById(id, (err, userDB) => {
    if (err) {
      removeFiles(filename, type);
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!userDB) {
      removeFiles(filename, type);
      return res.status(400).json({
        ok: false,
        err: {
          message: "User Not Fund",
        },
      });
    }

    removeFiles(userDB.img, type); // Remove the past Images

    userDB.img = filename;
    userDB.save((err, userSave) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        user: userSave,
      });
    });
  });
}

function productsImage(id, res, filename, type) {
  Product.findById(id, (err, productDB) => {
    if (err) {
      removeFiles(filename, type);
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!productDB) {
      removeFiles(filename, type);
      return res.status(400).json({
        ok: false,
        err: {
          message: "Not Found Product",
        },
      });
    }

    removeFiles(productDB.img, type);

    productDB.img = filename;
    productDB.save((err, productSave) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        user: productSave,
      });
    });
  });
}

function removeFiles(fileName, type) {
  let pathUrl = path.resolve(__dirname, `../../uploads/${type}/${fileName}`); // File Path

  if (fs.existsSync(pathUrl)) {
    fs.unlinkSync(pathUrl);
  }
}
module.exports = app;
