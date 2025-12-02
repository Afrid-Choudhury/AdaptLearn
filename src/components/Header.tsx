import React from 'react';
import { Bot } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between py-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
             {/* Using Bot as an abstract logo placeholder */}
             <Bot className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-white">
          AdaptLearn
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-4">
        <button className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
          Sign In
        </button>
        <button className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]">
          Get Started
        </button>
      </nav>
      
      {/* Mobile Menu Button Placeholder */}
      <button className="md:hidden text-gray-300">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
    </header>
  );
};

export default Header;