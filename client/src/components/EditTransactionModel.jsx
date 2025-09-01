import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const EditTransactionModel = ({ transaction, isOpen, onClose, onUpdate }) => {
  // State for the form fields
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  // This useEffect hook runs whenever the 'transaction' prop changes.
  // It populates the form fields with the data of the transaction to be edited.
  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount);
      setCategory(transaction.category);
      setDescription(transaction.description || '');
    }
  }, [transaction]);

  // If the model is not open or there's no transaction data, render nothing.
  if (!isOpen || !transaction) {
    return null;
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseFloat(amount) <= 0 || !category) {
      toast.error('Please enter a valid amount and category.');
      return;
    }
    const updatedData = { amount, category, description };
    // Call the onUpdate function passed from HomePage with the transaction ID and new data
    onUpdate(transaction._id, updatedData);
  };

  return (
    // Model overlay
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      {/* Model content */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Edit Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-amount" className="block text-sm font-medium text-gray-400">Amount (₹)</label>
            <input 
              type="number" 
              id="edit-amount" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              required
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="edit-category" className="block text-sm font-medium text-gray-400">Category</label>
            <input 
              type="text" 
              id="edit-category" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              required
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-400">Description (Optional)</label>
            <input 
              type="text" 
              id="edit-description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModel;