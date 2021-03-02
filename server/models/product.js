var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
  name: { type: String, required: [true, "The Username is Required"] },
  unitPrice: {
    type: Number,
    required: [true, "The Unit Price is Required"],
  },
  description: { type: String, required: false },
  available: { type: Boolean, required: true, default: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Product", schema);
