import React from 'react';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';

const WelcomePage = () => {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 overflow-hidden bg-gradient-to-br from-gray-900 to-indigo-900">
            {/* Decorative Background Blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            {/* Main Content */}
            <div className="relative z-10">
                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight
                       bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                    Personal Finance Assistant
                </h1>

                <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300 mb-12">
                    Take control of your finances with ease. Track your income, manage expenses, and visualize your spending habits all in one place.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    {/* Clerk Sign-In Button */}
                    <SignInButton mode="modal">
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-full text-lg 
                             transition duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-indigo-500/30">
                            Login
                        </button>
                    </SignInButton>

                    {/* Clerk Sign-Up Button - Now with a subtle glow effect */}
                    <SignUpButton mode="modal">
                        <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-10 rounded-full text-lg
                             transition duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-purple-500/30">
                            Sign Up
                        </button>
                    </SignUpButton>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;