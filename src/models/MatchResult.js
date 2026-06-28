const mongoose = require("mongoose");

const matchResultSchema =
  new mongoose.Schema(
    {
      poId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true,
      },

      grnId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true,
      },

      invoiceId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true,
      },

      status: {
        type: String,

        enum: [
          "MATCHED",
          "PARTIAL_MATCH",
          "MISMATCH",
        ],

        default:
          "PARTIAL_MATCH",
      },

      matchedItems: {
        type: Number,
        default: 0,
      },

      mismatchedItems: {
        type: Number,
        default: 0,
      },

      matchPercentage: {
        type: Number,
        default: 0,
      },

      discrepancies: [
        {
          field: String,

          itemCode: String,

          expected:
            mongoose.Schema.Types.Mixed,

          actual:
            mongoose.Schema.Types.Mixed,

          message: String,
        },
      ],
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "MatchResult",
    matchResultSchema
  );