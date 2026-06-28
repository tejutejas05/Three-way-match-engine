function normalizeText(text) {
  if (!text) return "";

  return text
    .replace(/\s+/g, " ")
    .replace(/\s+\./g, ".")
    .replace(/\.\s+/g, ".")
    .trim();
}

function normalizeItem(item) {
  return {
    itemCode:
      item.itemCode
        ? String(
            item.itemCode
          ).trim()
        : null,

    sku:
      item.sku || null,

    description:
      normalizeText(
        item.description
      ),

    quantity:
      Number(
        item.quantity
      ) || 0,

    receivedQuantity:
      Number(
        item.receivedQuantity
      ) || 0,

    unitPrice:
      Number(
        item.unitPrice
      ) || 0,

    totalPrice:
      Number(
        item.totalPrice
      ) || 0,
  };
}

module.exports = {
  normalizeText,
  normalizeItem,
};