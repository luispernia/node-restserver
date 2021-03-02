const mongoose = require("mongoose");
let { Schema } = mongoose; // Get the Schema function
let uniqueValidator = require("mongoose-unique-validator");

let rolesValid = {
  // Set the only accepted values
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} isn't a valid value",
};

let userSchema = new Schema({
  // Stablish a Schema object of whatever you want, in this case a User
  name: {
    type: String, // Type of data
    required: [true, "The name is required, Please fill out"], // Required or not
  },
  email: {
    type: String,
    unique: true,
    required: [true, "The email is required, Please fill out"],
  },
  password: {
    type: String,
    required: [true, "The password is required, Please fill out"],
  },
  img: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: "USER_ROLE",
    enum: rolesValid, // This is for accept only the parameters we want
  },
  status: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

userSchema.plugin(uniqueValidator, { message: "{PATH} Required to be unique" });

userSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

module.exports = mongoose.model("User", userSchema);
