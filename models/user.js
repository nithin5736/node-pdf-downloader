const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  nums: {
    type: [
      {
        value: {
          type: String,
        },
        token: {
          type: String,
        },
      },
    ],
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
