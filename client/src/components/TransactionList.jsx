import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const TransactionList = ({ transactions = [], onEdit, onDelete, onPrevPage, onNextPage, currentPage, totalPages }) => {
  if (transactions.length === 0) {
    return <p className="text-gray-500 text-center py-8">No transactions found.</p>;
  }
  
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB');

  const getNumericAmount = (amount) => {
    if (typeof amount === 'object' && amount !== null && amount.$numberDecimal) {
      return parseFloat(amount.$numberDecimal);
    }
    return parseFloat(amount);
  };

  return (
    <>
      <div className="space-y-3">
        {transactions.map((t) => (
          <div key={t._id} className="bg-gray-900 p-4 rounded-lg flex justify-between items-center border border-gray-700 group">
            <div className="flex items-center gap-4">
              <div className={`w-2 h-12 rounded-full ${t.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div>
                <p className="font-semibold capitalize text-white">{t.category}</p>
                <p className="text-sm text-gray-400">{t.description || ''}</p>
                <p className="text-sm text-gray-400">{formatDate(t.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className={`font-bold text-lg ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                {t.type === 'income' ? '+' : '-'} ₹{getNumericAmount(t.amount).toLocaleString('en-IN')}
              </p>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(t)} className="p-2 text-gray-400 hover:text-blue-400"><FiEdit size={16}/></button>
                <button onClick={() => onDelete(t._id)} className="p-2 text-gray-400 hover:text-red-400"><FiTrash2 size={16}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-6">
        <button onClick={onPrevPage} disabled={currentPage <= 1} className="bg-gray-700 hover:bg-gray-600 font-bold py-2 px-4 rounded-md transition disabled:opacity-50">Previous</button>
        <span className="text-gray-400">Page {currentPage} of {totalPages}</span>
        <button onClick={onNextPage} disabled={currentPage >= totalPages} className="bg-gray-700 hover:bg-gray-600 font-bold py-2 px-4 rounded-md transition disabled:opacity-50">Next</button>
      </div>
    </>
  );
};

export default TransactionList;