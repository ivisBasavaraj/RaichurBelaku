import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-newspaper-blue text-white py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.jpg" 
              alt="ರಾಯಚೂರು ಬೆಳಕು Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
            />
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-bold mb-1">ರಾಯಚೂರು ಬೆಳಕು</h3>
              <p className="text-sm sm:text-base text-blue-200">ನಿಮ್ಮ ವಿಶ್ವಾಸಾರ್ಹ ಡಿಜಿಟಲ್ ಪತ್ರಿಕೆ</p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-xs sm:text-sm text-blue-200">
              © 2024 ರಾಯಚೂರು ಬೆಳಕು. ಎಲ್ಲಾ ಹಕ್ಕುಗಳು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;