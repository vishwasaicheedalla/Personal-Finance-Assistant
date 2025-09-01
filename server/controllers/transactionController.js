import Transaction from '../models/transactionModel.js';

export const getTransactions = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = { userId: req.auth.sub };
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const transactions = await Transaction.find(query).sort({ date: -1 }).skip(skip).limit(limit);
    const count = await Transaction.countDocuments(query);

    res.status(200).json({
      transactions,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;
    if (!type || !amount || !category) {
      return res.status(400).json({ message: 'Type, amount, and category are required.' });
    }
    const newTransaction = new Transaction({
      userId: req.auth.sub, type, amount, category, description,
      date: date ? new Date(date) : new Date(),
    });
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(400).json({ message: 'Invalid data provided.' });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, description } = req.body;
    const transaction = await Transaction.findById(id);

    if (!transaction) return res.status(404).json({ message: 'Transaction not found.' });
    if (transaction.userId !== req.auth.sub) return res.status(403).json({ message: 'User not authorized.' });

    transaction.amount = amount || transaction.amount;
    transaction.category = category || transaction.category;
    transaction.description = description !== undefined ? description : transaction.description;

    const updatedTransaction = await transaction.save();
    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction) return res.status(404).json({ message: 'Transaction not found.' });
    if (transaction.userId !== req.auth.sub) return res.status(403).json({ message: 'User not authorized.' });

    await transaction.deleteOne();
    res.status(200).json({ message: 'Transaction removed successfully.' });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};