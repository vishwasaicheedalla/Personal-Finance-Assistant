import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SummaryGraph = ({ transactions = [], filter = 'all' }) => {
  const getNumericAmount = (amount) => {
    // This handles both Decimal128 objects and plain numbers
    if (typeof amount === 'object' && amount !== null && amount.$numberDecimal) {
      return parseFloat(amount.$numberDecimal);
    }
    return parseFloat(amount);
  };

  const filteredTransactions = filter === 'all'
    ? transactions
    : transactions.filter(t => t.category === filter);

  const dataByCategory = filteredTransactions.reduce((acc, transaction) => {
    const category = transaction.category;
    const amount = getNumericAmount(transaction.amount);
    if (isNaN(amount)) return acc;

    if (!acc[category]) {
      acc[category] = { income: 0, expense: 0 };
    }

    if (transaction.type === 'income') {
      acc[category].income += amount;
    } else {
      acc[category].expense += amount;
    }
    return acc;
  }, {});

  const labels = Object.keys(dataByCategory);
  const incomeData = labels.map(cat => dataByCategory[cat].income);
  const expenseData = labels.map(cat => dataByCategory[cat].expense);

  const chartData = {
    labels,
    datasets: [
      { label: 'Income', data: incomeData, backgroundColor: 'rgba(74, 222, 128, 0.7)' },
      { label: 'Expenses', data: expenseData, backgroundColor: 'rgba(239, 68, 68, 0.7)' },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#9ca3af' } },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed.y)}`
        }
      }
    },
    scales: {
      x: { stacked: true, ticks: { color: '#9ca3af' }, grid: { display: false } },
      y: { stacked: true, beginAtZero: true, ticks: { color: '#9ca3af' }, grid: { color: '#374151' } },
    },
  };
  
  if (filteredTransactions.length === 0) {
    return <div className="h-80 flex items-center justify-center text-gray-500">No data for the selected category.</div>;
  }

  return (
    <div className="h-80 relative">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default SummaryGraph;