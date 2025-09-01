import React from 'react';
import { useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
// import { FaPiggyBank } from 'react-icons/fa'; // Icon for the logo
// import { FiLogOut } from 'react-icons/fi'; // Icon for the sign out button

const Navbar = () => {
    const { signOut } = useClerk();
    const navigate = useNavigate();

    const handleSignOut = () => {
        signOut(() => navigate('/'));
    };

    return (
        <nav className="bg-gray-800 border-b border-gray-700 shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and App Name */}
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        {/* <FaPiggyBank className="h-8 w-8 text-indigo-400" /> */}
                        <span className="text-white font-bold text-xl ml-3 tracking-wider">
                            FinTrack
                        </span>
                    </div>

                    {/* Sign Out Button */}
                    <button
                        onClick={handleSignOut}
                        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg
                       transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        {/* <FiLogOut className="h-5 w-5" /> */}
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;