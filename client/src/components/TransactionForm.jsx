import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

const TransactionForm = ({ onTransactionAdded, categories = [], onNewCategory }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [type, setType] = useState('income');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const { getToken } = useAuth();

  const handleReceiptChange = async (file) => {
    if (!file) return;
    setIsOcrProcessing(true);
    toast.loading('Extracting data from receipt...');
    const ocrFormData = new FormData();
    ocrFormData.append('receipt', file);
    try {
      const token = await getToken();
      const res = await axios.post('/api/ocr/extract', ocrFormData, { headers: { 'Authorization': `Bearer ${token}` } });
      toast.dismiss();
      toast.success('Data extracted!');
      if (res.data.amount) setAmount(res.data.amount);
      if (res.data.category) setCategory(res.data.category);
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || 'Could not extract data.');
    } finally {
      setIsOcrProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalCategory = category === 'new' ? newCategory : category;
    if (parseFloat(amount) <= 0 || !finalCategory) {
      toast.error('Please enter a valid amount and category.');
      return;
    }
    if (category === 'new' && !categories.includes(newCategory)) {
      onNewCategory(newCategory);
    }
    setIsSubmitting(true);
    const loadingToast = toast.loading('Adding transaction...');
    try {
      const token = await getToken();
      const res = await axios.post('/api/transactions', { type, amount, category: finalCategory, description }, { headers: { 'Authorization': `Bearer ${token}` } });
      onTransactionAdded(res.data);
      toast.dismiss(loadingToast);
      toast.success('Transaction added!');
      setAmount('');
      setCategory('');
      setNewCategory('');
      setDescription('');
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('Failed to add transaction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-2 p-1 bg-gray-900 rounded-lg">
        <button type="button" onClick={() => setType('income')} className={`py-2 px-4 rounded-md text-sm font-semibold transition ${type === 'income' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:bg-gray-700'}`}>Income</button>
        <button type="button" onClick={() => setType('expense')} className={`py-2 px-4 rounded-md text-sm font-semibold transition ${type === 'expense' ? 'bg-red-600 text-white' : 'bg-transparent text-gray-400 hover:bg-gray-700'}`}>Expense</button>
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-400">Amount (₹)</label>
        <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3" />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-400">Category</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3">
          <option value="" disabled>Select a category</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          <option value="new">-- Add New Category --</option>
        </select>
      </div>
      {category === 'new' && (
        <div>
          <label htmlFor="new-category" className="block text-sm font-medium text-gray-400">New Category Name</label>
          <input type="text" id="new-category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3" />
        </div>
      )}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-400">Description (Optional)</label>
        <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3" />
      </div>
      <div>
        <label htmlFor="receipt" className="block text-sm font-medium text-gray-400">Upload Receipt (Optional)</label>
        <input type="file" id="receipt" accept="image/*,application/pdf" onChange={(e) => handleReceiptChange(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0" />
      </div>
      <button type="submit" disabled={isSubmitting || isOcrProcessing} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition disabled:opacity-50">
        {isSubmitting ? 'Adding...' : (isOcrProcessing ? 'Processing...' : 'Add Transaction')}
      </button>
    </form>
  );
};

export default TransactionForm;