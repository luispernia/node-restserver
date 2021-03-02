const express = require("express");
const Category = require("../models/category");
const app = express();

let { verifyToken, verifyRole } = require("../middlewares/authentication");

app.get("/categories", verifyToken, (req, res) => {
  Category.find({})
    .sort("name") // Sort by propertyName
    .populate("user", "name") // PropertyName, paramsToExtract
    .exec((err, catsDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      if (catsDB.length < 1) {
        res.status(400).json({
          ok: false,
          err: {
            message: "Categories Empty",
          },
        });
      }
      res.json({
        ok: true,
        categories: catsDB,
      });
    });
});
app.get("/categories/:name", verifyToken, (req, res) => {
  Category.findOne({ name: req.params.name }).exec((err, catDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      category: catDB,
    });
  });
});

app.post("/categories", [verifyToken, verifyRole], (req, res) => {
  let body = req.body;
  let category = new Category({
    name: body.name.toLowerCase(),
    user: req.user._id,
  });

  category.save((err, catDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      cat: catDB,
    });
  });
});

app.put("/categories/:name", [verifyToken, verifyRole], (req, res) => {
  let body = req.body;
  let params = req.params;
  let newCat = { name: body.name.toLowerCase() };
  Category.findOneAndUpdate(
    { name: params.name },
    newCat,
    { new: true },
    (err, catDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      if (!catDB) {
        return res.status(401).json({
          ok: false,
          err: {
            message: `Category ${params.name} Not Exist`,
          },
        });
      }
      res.json({
        ok: true,
        cat: catDB,
      });
    }
  );
});

app.delete("/categories/:name", [verifyToken, verifyRole], (req, res) => {
  let params = req.params;
  Category.findOneAndRemove({ name: params.name }, (err, catRemoved) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    if (!catRemoved) {
      res.status(401).json({
        ok: false,
        err: {
          message: `Category (${params.name}) Not Found`,
        },
      });
    }
    res.json({
      ok: true,
      cat: catRemoved,
    });
  });
});

module.exports = app;
