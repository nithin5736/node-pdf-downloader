const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  member: {
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
  time: {
    type: Date,
    default: Date.now(),
  },
});

const Member = mongoose.model("Member", memberSchema);
module.exports = Member;
