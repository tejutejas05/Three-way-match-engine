const mongoose = require("mongoose");

const matchHistorySchema = new mongoose.Schema(
  {
    poNumber: {
      type: String,
      required: true
    },

    previousStatus: {
      type: String
    },

    newStatus: {
      type: String
    },

    reasons: [String]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "MatchHistory",
  matchHistorySchema
);