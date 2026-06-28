const MatchResult = require(
  "../models/MatchResult"
);

const {
  matchDocuments,
} = require(
  "../services/matching.service"
);

const createMatch =
  async (req, res) => {
    try {
      const {
        poId,
        grnId,
        invoiceId,
      } = req.body || {};

      if (
        !poId ||
        !grnId ||
        !invoiceId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "poId, grnId and invoiceId are required",
        });
      }

      const result =
        await matchDocuments(
          poId,
          grnId,
          invoiceId
        );

      const status =
        result.discrepancies
          .length === 0
          ? "MATCHED"
          : "PARTIAL_MATCH";

      const matchResult =
        await MatchResult.create({
          poId,
          grnId,
          invoiceId,

          status,

          matchedItems:
            result.matchedItems,

          mismatchedItems:
            result.mismatchedItems,

          matchPercentage:
            result.matchPercentage,

          discrepancies:
            result.discrepancies,
        });

      return res.status(200).json({
        success: true,

        summary: {
          totalPOItems:
            result.totalPOItems,

          matchedItems:
            result.matchedItems,

          mismatchedItems:
            result.mismatchedItems,

          matchPercentage:
            result.matchPercentage,
        },

        data: matchResult,
      });
    } catch (error) {
      console.error(
        "Match Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

module.exports = {
  createMatch,
};