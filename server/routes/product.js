// Update a product /:name

// Delete a product /:name {available=false}

const express = require("express");
const app = express();
const Product = require("../models/product");
const { verifyToken } = require("../middlewares/authentication");
const { findByIdAndUpdate } = require("../models/product");

app.get("/products", verifyToken, (req, res) => {
  let { from, limit } = req.query;
  from = Number(from || 0);
  limit = Number(limit || 5);
  Product.find({ available: true })
    .skip(from)
    .limit(limit)
    .populate("user", "name email")
    .populate("category", "name")
    .exec((err, productsDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      if (!productsDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "No products found in database",
          },
        });
      }
      Product.count({ available: true }, (err, count) => {
        res.json({
          ok: true,
          products: productsDB,
          count,
        });
      });
    });
});

app.get("/products/:id", verifyToken, (req, res) => {
  let { id } = req.params;
  Product.findById(id)
    .populate("user", "name email")
    .populate("category", "name")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      if (!product) {
        res.status(400).json({
          ok: false,
          err: {
            message: "Product Not Found",
          },
        });
      }

      res.json({
        ok: true,
        product,
      });
    });
});

app.get("/products/search/:term", (req, res) => {
  let { term } = req.params;
  let regex = new RegExp(term, "i");
  Product.find({ name: regex, available: true })
    .populate("category", "name")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        product,
      });
    });
});

app.post("/products", verifyToken, (req, res) => {
  let body = req.body;
  let { name, unitPrice, description, available, category } = body;
  let { _id } = req.user;

  let product = new Product({
    name,
    unitPrice,
    description,
    available,
    category,
    user: _id,
  });

  product.save((err, product) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      product: product,
    });
  });
});

app.put("/products/:id", verifyToken, (req, res) => {
  let { id } = req.params;
  let body = req.body;

  Product.findByIdAndUpdate(id, body, { new: true }, (err, product) => {
    console.log(product);
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    if (!product) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Not Found Product",
        },
      });
    }
    res.json({
      ok: true,
      product,
    });
  });
});

app.delete("/products/:id", verifyToken, (req, res) => {
  let { id } = req.params;
  let available = { available: false };
  Product.findByIdAndUpdate(id, available, { new: true }, (err, product) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    if (!product) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Not Found Product",
        },
      });
    }

    res.json({
      ok: true,
      product,
    });
  });
});

module.exports = app;
