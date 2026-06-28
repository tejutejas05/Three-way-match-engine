const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    itemCode: {
      type: String,
      default: null
    },

    sku: {
      type: String,
      default: null
    },

    description: {
      type: String,
      default: null
    },

    quantity: {
      type: Number,
      default: 0
    },

    receivedQuantity: {
      type: Number,
      default: 0
    },

    unitPrice: {
      type: Number,
      default: 0
    },

    totalPrice: {
      type: Number,
      default: 0
    }
  },
  {
    _id: false
  }
);

const documentSchema = new mongoose.Schema(
  {
    // Document Type
    documentType: {
      type: String,
      enum: ["PO", "GRN", "INVOICE"],
      required: true,
      index: true,
    },

    // Processing State
    processingStatus: {
      type: String,
      enum: [
        "UPLOADED",
        "PROCESSING",
        "EXTRACTED",
        "MATCHED",
        "FAILED",
      ],
      default: "UPLOADED",
      
    },

    // Common Business Fields
    poNumber: {
      type: String,
      trim: true,
      index: true,
    },

    documentNumber: {
      type: String,
      trim: true,
    },

    vendorName: {
      type: String,
      trim: true,
    },

    documentDate: {
      type: Date,
    },

    // File Information
    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
    },

    mimeType: {
      type: String,
      default: "application/pdf",
    },

    // Gemini Extraction Output
    parsedData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Extracted Line Items
    items: {
      type: [itemSchema],
      default: [],
    },

    // Error Tracking
    extractionError: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Useful Indexes
documentSchema.index({
  documentType: 1,
  poNumber: 1,
});

documentSchema.index({
  processingStatus: 1,
});

module.exports = mongoose.model("Document", documentSchema);