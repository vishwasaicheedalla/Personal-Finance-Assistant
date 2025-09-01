import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useUser, useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import Navbar from '../components/Navbar';
import SummaryGraph from '../components/SummaryGraph';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import EditTransactionModel from '../components/EditTransactionModel'; // Renamed import

const HomePage = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  
  // State for data and UI
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for filters
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState(new Date());
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // State for the edit "model"
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }).toString();
      
      const response = await axios.get(`/api/transactions?${params}`, { headers: { 'Authorization': `Bearer ${token}` } });
      setTransactions(response.data.transactions);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      toast.error('Failed to load transaction data.');
    } finally {
      setLoading(false);
    }
  }, [getToken, currentPage, startDate, endDate]);
  
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    if (transactions.length > 0) {
      const uniqueCategories = [...new Set(transactions.map(t => t.category))];
      setCategories(uniqueCategories);
    }
  }, [transactions]);

  const handleTransactionAdded = (newTransaction) => {
    // Instantly update the UI by adding the new transaction to the state
    setTransactions(prev => [newTransaction, ...prev]);
  };
  
  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModelOpen(true);
  };

  const handleUpdateTransaction = async (id, data) => {
    try {
      const token = await getToken();
      await axios.put(`/api/transactions/${id}`, data, { headers: { 'Authorization': `Bearer ${token}` } });
      toast.success('Transaction updated!');
      setIsModelOpen(false);
      fetchTransactions(); // Refetch to ensure data consistency
    } catch (err) {
      toast.error('Failed to update transaction.');
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        const token = await getToken();
        await axios.delete(`/api/transactions/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
        toast.success('Transaction deleted!');
        fetchTransactions(); // Refetch to ensure data consistency
      } catch (err) {
        toast.error('Failed to delete transaction.');
      }
    }
  };

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  
  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <main className="container mx-auto p-4 md:p-8 text-white">
        <header className="mb-10">
          <h1 className="text-4xl font-bold">Welcome back, {user?.firstName}!</h1>
          <p className="text-gray-400">Here's your financial overview.</p>
        </header>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
           <div className="flex-1">
             <label className="text-sm text-gray-400 block mb-1">Start Date</label>
             <DatePicker selected={startDate} onChange={date => setStartDate(date)} className="w-full bg-gray-700 p-2 rounded-md text-white"/>
           </div>
            <div className="flex-1">
             <label className="text-sm text-gray-400 block mb-1">End Date</label>
             <DatePicker selected={endDate} onChange={date => setEndDate(date)} className="w-full bg-gray-700 p-2 rounded-md text-white"/>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Transactions by Category</h2>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-gray-700 p-2 rounded-md text-white border-gray-600 focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <SummaryGraph transactions={transactions} filter={selectedCategory} />
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
              {loading ? <p className="text-center text-gray-400">Loading...</p> : 
                <TransactionList 
                  transactions={transactions} 
                  onEdit={handleEditClick} 
                  onDelete={handleDeleteTransaction}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onNextPage={nextPage}
                  onPrevPage={prevPage}
                />
              }
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-fit">
            <h2 className="text-2xl font-semibold mb-4">Add Transaction</h2>
            <TransactionForm 
              onTransactionAdded={handleTransactionAdded}
              categories={categories}
              onNewCategory={(newCategory) => setCategories(prev => [...prev, newCategory])}
            />
          </div>
        </div>
      </main>
      <EditTransactionModel 
        isOpen={isModelOpen} 
        onClose={() => setIsModelOpen(false)} 
        transaction={selectedTransaction}
        onUpdate={handleUpdateTransaction}
      />
    </div>
  );
};

export default HomePage;