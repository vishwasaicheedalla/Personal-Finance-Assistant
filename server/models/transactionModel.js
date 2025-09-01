import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true }, // Clerk User ID
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
        // Ensure the amount is never negative.
        validate: {
            validator: (v) => v >= 0,
            message: 'Amount must not be negative.'
        }
    },
    category: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

// A compound index on userId and date will be very efficient for fetching
// a user's transactions, sorted by date.
transactionSchema.index({ userId: 1, date: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;