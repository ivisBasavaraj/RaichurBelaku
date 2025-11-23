import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="bg-white shadow-lg border-b-4 border-newspaper-blue">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo.jpg" 
              alt="ರಾಯಚೂರು ಬೆಳಕು Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
            />
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-newspaper-blue">ರಾಯಚೂರು ಬೆಳಕು</h1>
              <p className="text-xs sm:text-sm text-gray-600">Raichuru Belku</p>
            </div>
          </Link>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-newspaper-blue hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-newspaper-blue"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          {/* Desktop menu */}
          <div className="hidden md:flex space-x-2 lg:space-x-6">
            <Link 
              to="/" 
              className={`px-2 lg:px-4 py-2 rounded-lg transition-colors text-sm lg:text-base ${
                isActive('/') 
                  ? 'bg-newspaper-blue text-white' 
                  : 'text-newspaper-blue hover:bg-blue-50'
              }`}
            >
              ಮುಖ್ಯ ಪುಟ
            </Link>
            <Link 
              to="/today" 
              className={`px-2 lg:px-4 py-2 rounded-lg transition-colors text-sm lg:text-base ${
                isActive('/today') 
                  ? 'bg-newspaper-blue text-white' 
                  : 'text-newspaper-blue hover:bg-blue-50'
              }`}
            >
              ಇಂದಿನ ಪತ್ರಿಕೆ
            </Link>
            <Link 
              to="/archive" 
              className={`px-2 lg:px-4 py-2 rounded-lg transition-colors text-sm lg:text-base ${
                isActive('/archive') 
                  ? 'bg-newspaper-blue text-white' 
                  : 'text-newspaper-blue hover:bg-blue-50'
              }`}
            >
              ಸಂಗ್ರಹಿತ ಪತ್ರಿಕೆಗಳು
            </Link>
            <Link 
              to="/admin" 
              className={`px-2 lg:px-4 py-2 rounded-lg transition-colors text-sm lg:text-base ${
                isActive('/admin') 
                  ? 'bg-newspaper-red text-white' 
                  : 'text-newspaper-red hover:bg-red-50'
              }`}
            >
              ಆಡಳಿತ
            </Link>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="pb-4 pt-2 space-y-1 border-t border-gray-200 mt-4">
            <Link 
              to="/" 
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg transition-colors text-base font-medium ${
                isActive('/') 
                  ? 'bg-newspaper-blue text-white' 
                  : 'text-newspaper-blue hover:bg-blue-50 active:bg-blue-100'
              }`}
            >
              ಮುಖ್ಯ ಪುಟ
            </Link>
            <Link 
              to="/today" 
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg transition-colors text-base font-medium ${
                isActive('/today') 
                  ? 'bg-newspaper-blue text-white' 
                  : 'text-newspaper-blue hover:bg-blue-50 active:bg-blue-100'
              }`}
            >
              ಇಂದಿನ ಪತ್ರಿಕೆ
            </Link>
            <Link 
              to="/archive" 
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg transition-colors text-base font-medium ${
                isActive('/archive') 
                  ? 'bg-newspaper-blue text-white' 
                  : 'text-newspaper-blue hover:bg-blue-50 active:bg-blue-100'
              }`}
            >
              ಸಂಗ್ರಹಿತ ಪತ್ರಿಕೆಗಳು
            </Link>
            <Link 
              to="/admin" 
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg transition-colors text-base font-medium ${
                isActive('/admin') 
                  ? 'bg-newspaper-red text-white' 
                  : 'text-newspaper-red hover:bg-red-50 active:bg-red-100'
              }`}
            >
              ಆಡಳಿತ
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;