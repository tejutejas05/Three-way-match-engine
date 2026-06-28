const express = require("express");

const router = express.Router();

const upload = require(
  "../middleware/upload.middleware"
);

const {
  uploadDocument,
  getAllDocuments,
  getDocumentById,
} = require(
  "../controllers/document.controller"
);

const {
  createMatch,
} = require(
  "../controllers/match.controller"
);

/*
 * Upload Document
 */
router.post(
  "/upload",
  upload.single("file"),
  uploadDocument
);

/*
 * Get All Documents
 */
router.get(
  "/",
  getAllDocuments
);

/*
 * Health Check
 */
router.get(
  "/health",
  (req, res) => {
    res.status(200).json({
      success: true,
      service:
        "Three Way Match Engine",
      status: "Running",
      timestamp:
        new Date().toISOString(),
    });
  }
);

/*
 * Run 3-Way Match
 */
router.post(
  "/match",
  createMatch
);

/*
 * Get Document By ID
 * Keep this route LAST
 */
router.get(
  "/:id",
  getDocumentById
);

module.exports = router;