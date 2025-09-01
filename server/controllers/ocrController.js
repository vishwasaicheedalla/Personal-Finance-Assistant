import Tesseract from 'tesseract.js';

const parseTotalAmount = (text) => {
  const regex = /(?:total|amount|subtotal|balance due)\s*:?\s*[$₹€]?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i;
  const lines = text.split('\n');
  let highestAmount = 0;

  for (const line of lines) {
    const match = line.match(regex);
    if (match && match[1]) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      if (amount > highestAmount) {
        highestAmount = amount;
      }
    }
  }
  return highestAmount > 0 ? highestAmount : null;
};

export const extractDataFromReceipt = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No receipt file uploaded.' });
  }
  try {
    const { data: { text } } = await Tesseract.recognize(req.file.buffer, 'eng');
    const totalAmount = parseTotalAmount(text);
    if (!totalAmount) {
      return res.status(400).json({ message: 'Could not find a total amount on the receipt.' });
    }
    res.status(200).json({
      amount: totalAmount,
      category: 'General',
    });
  } catch (error) {
    console.error("OCR processing failed:", error);
    res.status(500).json({ message: 'Error processing the receipt.' });
  }
};