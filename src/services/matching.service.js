const Document = require("../models/Document");
const similarity = require("string-similarity");

function normalizeText(text) {
  if (!text) return "";

  return text
    .toLowerCase()
    .replace(/colour:.*/gi, "")
    .replace(/size:.*/gi, "")
    .replace(/brand:.*/gi, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findMatchingItem(
  poItem,
  targetItems
) {
  const poDescription =
    normalizeText(
      poItem.description
    );

  let bestMatch = null;
  let bestScore = 0;

  for (const item of targetItems) {
    const targetDescription =
      normalizeText(
        item.description
      );

    const textScore =
      similarity.compareTwoStrings(
        poDescription,
        targetDescription
      );

    const quantityMatch =
      Number(poItem.quantity) ===
      Number(item.quantity);

    const priceMatch =
      Math.abs(
        Number(poItem.unitPrice || 0) -
          Number(item.unitPrice || 0)
      ) < 2;

    let finalScore = textScore;

    if (quantityMatch) {
      finalScore += 0.2;
    }

    if (priceMatch) {
      finalScore += 0.2;
    }

    if (finalScore > bestScore) {
      bestScore = finalScore;
      bestMatch = item;
    }
  }

  // similarity threshold
  if (bestScore >= 0.55) {
    return bestMatch;
  }

  return null;
}

async function matchDocuments(
  poId,
  grnId,
  invoiceId
) {
  const po =
    await Document.findById(poId);

  const grn =
    await Document.findById(grnId);

  const invoice =
    await Document.findById(
      invoiceId
    );

  if (!po || !grn || !invoice) {
    throw new Error(
      "Documents not found"
    );
  }

  console.log(
    "PO Items:",
    po.items.length
  );

  console.log(
    "GRN Items:",
    grn.items.length
  );

  console.log(
    "Invoice Items:",
    invoice.items.length
  );

  const discrepancies = [];

  let matchedItems = 0;

  for (const poItem of po.items) {
    const grnItem =
      findMatchingItem(
        poItem,
        grn.items
      );

    const invoiceItem =
      findMatchingItem(
        poItem,
        invoice.items
      );

    if (!grnItem) {
      discrepancies.push({
        field: "item",
        itemCode:
          poItem.itemCode,
        expected: "Present",
        actual: "Missing",
        message:
          "Item missing in GRN",
      });

      continue;
    }

    if (!invoiceItem) {
      discrepancies.push({
        field: "item",
        itemCode:
          poItem.itemCode,
        expected: "Present",
        actual: "Missing",
        message:
          "Item missing in Invoice",
      });

      continue;
    }

    if (
      Number(poItem.quantity) !==
      Number(grnItem.quantity)
    ) {
      discrepancies.push({
        field: "quantity",
        itemCode:
          poItem.itemCode,
        expected:
          poItem.quantity,
        actual:
          grnItem.quantity,
        message:
          "PO vs GRN quantity mismatch",
      });

      continue;
    }

    if (
      Number(poItem.quantity) !==
      Number(
        invoiceItem.quantity
      )
    ) {
      discrepancies.push({
        field: "quantity",
        itemCode:
          poItem.itemCode,
        expected:
          poItem.quantity,
        actual:
          invoiceItem.quantity,
        message:
          "PO vs Invoice quantity mismatch",
      });

      continue;
    }

    matchedItems++;
  }

  const totalPOItems =
    po.items.length;

  const mismatchedItems =
    discrepancies.length;

  const matchPercentage =
    totalPOItems > 0
      ? Number(
          (
            (matchedItems /
              totalPOItems) *
            100
          ).toFixed(2)
        )
      : 0;

  return {
    totalPOItems,
    matchedItems,
    mismatchedItems,
    matchPercentage,
    discrepancies,
  };
}

module.exports = {
  matchDocuments,
};