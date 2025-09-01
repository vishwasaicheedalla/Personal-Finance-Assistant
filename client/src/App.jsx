import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SignedIn, SignedOut, ClerkLoading } from "@clerk/clerk-react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import HomePage from './pages/HomePage';
import WelcomePage from './pages/WelcomePage';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const MainLayout = () => (
  <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
    <Outlet />
  </div>
);

const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
    </div>
);


function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            <>
              <ClerkLoading>
                <LoadingSpinner />
              </ClerkLoading>

              <SignedIn>
                <HomePage />
              </SignedIn>

              <SignedOut>
                <WelcomePage />
              </SignedOut>
            </>
          }
        />
        {/* The /login and /sign-up routes have been removed */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;