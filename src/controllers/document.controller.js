const Document = require("../models/Document");

const {
  extractDocumentData,
} = require("../services/extraction.service");

const uploadDocument = async (
  req,
  res
) => {
  try {
    const { documentType } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required",
      });
    }

    if (
      !["PO", "GRN", "INVOICE"].includes(
        documentType
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "documentType must be PO, GRN or INVOICE",
      });
    }

    const document =
      await Document.create({
        documentType,
        fileName:
          req.file.originalname,
        filePath:
          req.file.path,
        fileSize:
          req.file.size,
        mimeType:
          req.file.mimetype,
        processingStatus:
          "UPLOADED",
      });

    try {
      document.processingStatus =
        "PROCESSING";

      await document.save();

      const extractedData =
        await extractDocumentData(
          req.file.path
        );

      console.log(
        "Extracted Data:",
        extractedData
      );

      document.poNumber =
        extractedData.poNumber ||
        null;

      document.documentNumber =
        extractedData.documentNumber ||
        null;

      document.vendorName =
        extractedData.vendorName ||
        null;

      // Safe Date Parsing
      let parsedDate = null;

      if (
        extractedData.documentDate
      ) {
        console.log(
          "Raw Date:",
          extractedData.documentDate
        );

        const tempDate =
          new Date(
            extractedData.documentDate
          );

        if (
          !isNaN(
            tempDate.getTime()
          )
        ) {
          parsedDate =
            tempDate;
        } else {
          console.log(
            "Invalid date received from Gemini:",
            extractedData.documentDate
          );
        }
      }

      document.documentDate =
        parsedDate;

      document.items =
        extractedData.items || [];

      document.parsedData =
        extractedData;

      document.processingStatus =
        "EXTRACTED";

      document.extractionError =
        null;

      await document.save();
    } catch (
      extractionError
    ) {
      console.error(
        "Extraction Error:",
        extractionError
      );

      document.processingStatus =
        "FAILED";

      document.extractionError =
        extractionError.message;

      await document.save();
    }

    const updatedDocument =
      await Document.findById(
        document._id
      );

    return res.status(201).json({
      success: true,
      data: updatedDocument,
    });
  } catch (error) {
    console.error(
      "Upload Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to upload document",
      error: error.message,
    });
  }
};

const getAllDocuments =
  async (req, res) => {
    try {
      const documents =
        await Document.find().sort({
          createdAt: -1,
        });

      return res.status(200).json({
        success: true,
        count:
          documents.length,
        data: documents,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

const getDocumentById =
  async (req, res) => {
    try {
      const document =
        await Document.findById(
          req.params.id
        );

      if (!document) {
        return res.status(404).json({
          success: false,
          message:
            "Document not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: document,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

module.exports = {
  uploadDocument,
  getAllDocuments,
  getDocumentById,
};