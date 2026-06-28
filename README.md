# AI-Powered Three-Way Matching Engine

## Overview

This project automates procurement verification by matching:

- Purchase Order (PO)
- Goods Receipt Note (GRN)
- Invoice

The system uses Google Gemini AI to extract structured data from documents and performs intelligent matching using fuzzy logic and validation rules.

---

## Problem Statement

Manual procurement matching is:

- Time-consuming
- Error-prone
- Inconsistent due to vendor formatting differences
- Difficult to scale

This system automates the entire reconciliation process using AI + backend logic.

---

## System Architecture

PDF Upload → Gemini AI Extraction → MongoDB Storage → Matching Engine → API Response

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Google Gemini API
- Multer
- Fuzzy Matching Logic

---

## Features

- PDF Upload API
- AI-based document extraction using Gemini
- MongoDB storage for structured data
- Three-way matching (PO, GRN, Invoice)
- Fuzzy string matching for real-world variations
- Quantity validation logic
- Match percentage calculation
- REST API architecture
- Docker support
- Postman testing

---

## Project Structure

- controllers
- routes
- services
- models
- middleware
- utils
- uploads
- Dockerfile
- docker-compose.yml
- server.js

---

## API Endpoints

### Upload Document
POST /api/documents/upload

Form Data:
- file
- documentType (PO / GRN / INVOICE)

---

### Get Documents
GET /api/documents

---

### Run Matching
POST /api/documents/match

Request Body:
{
  "poId": "string",
  "grnId": "string",
  "invoiceId": "string"
}

---

## Sample Output

{
  "matchPercentage": 70,
  "matchedItems": 28,
  "mismatchedItems": 12
}

---

## Key Highlights

- Real-world procurement automation
- AI-based document understanding using Gemini
- Fuzzy matching for inconsistent data
- Backend-heavy business logic implementation
- Production-style REST API design
- Dockerized deployment

---

## Known Limitations

- Matching accuracy (~70%) due to:
  - inconsistent item naming across documents
  - vendor formatting differences
  - occasional AI extraction inconsistencies

- Swagger not implemented due to time constraints
- Some edge cases may lead to partial mismatches

---

## Future Improvements

- Improve matching using embedding-based similarity models
- Enhance Gemini prompt tuning for better extraction accuracy
- Add Swagger/OpenAPI documentation
- Add retry mechanism for AI extraction failures
- Improve vendor/item normalization logic
- Add audit logs for tracking matching history

---

## How to Run

npm install  
npm start  

OR

docker-compose up --build

---

## Testing

All APIs tested using Postman.  
Screenshots are included in the repository.

---

## Status

Completed  
Tested  
Dockerized  
Ready for submission