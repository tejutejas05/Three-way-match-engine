const fs = require("fs");

const model = require("./gemini.service");

const {
  DOCUMENT_EXTRACTION_PROMPT,
} = require("../utils/prompts");

const {
  normalizeItem,
} = require("../utils/normalizeData");

async function extractDocumentData(
  filePath
) {
  try {
    const pdfBuffer =
      fs.readFileSync(filePath);

    const result =
      await model.generateContent([
        DOCUMENT_EXTRACTION_PROMPT,

        {
          inlineData: {
            data:
              pdfBuffer.toString(
                "base64"
              ),
            mimeType:
              "application/pdf",
          },
        },
      ]);

    const text =
      result.response.text();

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsedData;

    try {
      parsedData =
        JSON.parse(cleaned);
    } catch (error) {
      throw new Error(
        "Gemini returned invalid JSON"
      );
    }

    parsedData.documentType =
      parsedData.documentType ||
      null;

    parsedData.poNumber =
      parsedData.poNumber || null;

    parsedData.documentNumber =
      parsedData.documentNumber ||
      null;

    parsedData.vendorName =
      parsedData.vendorName ||
      null;

    parsedData.documentDate =
      parsedData.documentDate ||
      null;

    if (
      !Array.isArray(
        parsedData.items
      )
    ) {
      parsedData.items = [];
    }

    parsedData.items =
      parsedData.items.map(
        normalizeItem
      );

    return parsedData;
  } catch (error) {
    console.error(
      "Document Extraction Error:",
      error.message
    );

    throw error;
  }
}

module.exports = {
  extractDocumentData,
};