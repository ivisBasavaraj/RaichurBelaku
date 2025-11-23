import React, { useState } from 'react';

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Hardcoded credentials
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      onLogin();
      setError('');
    } else {
      setError('ತಪ್ಪು ಬಳಕೆದಾರ ಹೆಸರು ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <img 
              src="/logo.jpg" 
              alt="ರಾಯಚೂರು ಬೆಳಕು Logo" 
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover mx-auto mb-3 sm:mb-4"
            />
            <h2 className="text-xl sm:text-2xl font-bold text-newspaper-blue">ಆಡಳಿತ ಲಾಗಿನ್</h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">ರಾಯಚೂರು ಬೆಳಕು</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ಬಳಕೆದಾರ ಹೆಸರು
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newspaper-blue"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ಪಾಸ್‌ವರ್ಡ್
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newspaper-blue"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-newspaper-blue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              ಲಾಗಿನ್ ಮಾಡಿ
            </button>
          </form>

          <div className="mt-6 p-3 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-600 text-center">
              ಡೆಮೋ ಲಾಗಿನ್: admin / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;