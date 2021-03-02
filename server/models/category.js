const mongoose = require("mongoose");
const { Schema } = mongoose;
let uniqueValidator = require("mongoose-unique-validator");

let schema = new Schema({
  name: {
    type: String,
    required: [true, "And the name?"],
    unique: true,
  },
  user: {
    type: Schema.Types.ObjectId, // Type
    ref: "User", // Reference of the collection search
    required: true,
  },
  description: {
    type: String,
    default: "Another Category",
  },
});

schema.plugin(uniqueValidator, {
  message: "Category {PATH} Required to be unique",
});
schema.plugin(uniqueValidator, { message: "{PATH} Required to be unique" });

module.exports = mongoose.model("Category", schema);
