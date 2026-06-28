const DOCUMENT_EXTRACTION_PROMPT = `
You are an expert document parser.

Extract data from the PDF.

Return ONLY valid JSON.

Schema:

{
  "documentType": "",
  "poNumber": "",
  "documentNumber": "",
  "vendorName": "",
  "documentDate": "",
  "items": [
    {
      "itemCode": "",
      "description": "",
      "quantity": 0,
      "receivedQuantity": 0,
      "unitPrice": 0
    }
  ]
}

Rules:

1. Return only JSON.
2. Do not include markdown.
3. Do not explain.
4. Detect whether document is PO, GRN or INVOICE.
5. Extract all item rows.
`;

module.exports = {
  DOCUMENT_EXTRACTION_PROMPT,
};