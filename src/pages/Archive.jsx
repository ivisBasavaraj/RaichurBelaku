import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNewspapers } from '../utils/hybridStorage';

const Archive = () => {
  const [newspapers, setNewspapers] = useState([]);
  const [filteredNewspapers, setFilteredNewspapers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  useEffect(() => {
    const loadNewspapers = async () => {
      try {
        const savedNewspapers = await getNewspapers();
        setNewspapers(savedNewspapers);
        setFilteredNewspapers(savedNewspapers);
      } catch (error) {
        console.error('Error loading newspapers:', error);
        setNewspapers([]);
        setFilteredNewspapers([]);
      }
    };
    
    loadNewspapers();
  }, []);

  useEffect(() => {
    let filtered = newspapers.filter(newspaper =>
      newspaper.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    setFilteredNewspapers(filtered);
  }, [newspapers, searchTerm, sortBy]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('kn-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-newspaper-blue mb-1 sm:mb-2">ಸಂಗ್ರಹಿತ ಪತ್ರಿಕೆಗಳು</h1>
          <p className="text-sm sm:text-base text-gray-600">ಹಿಂದಿನ ಎಲ್ಲಾ ಆವೃತ್ತಿಗಳನ್ನು ಇಲ್ಲಿ ನೋಡಿ</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">ಹುಡುಕಿ</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ಪತ್ರಿಕೆ ಹೆಸರು ಹುಡುಕಿ..."
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newspaper-blue"
                />
                <svg className="absolute left-2 sm:left-3 top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="sm:w-40 md:w-48">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">ವಿಂಗಡಿಸಿ</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newspaper-blue"
              >
                <option value="date-desc">ಹೊಸದರಿಂದ ಹಳೆಯದಕ್ಕೆ</option>
                <option value="date-asc">ಹಳೆಯದರಿಂದ ಹೊಸದಕ್ಕೆ</option>
                <option value="name-asc">ಹೆಸರು (ಅ-ಹ)</option>
                <option value="name-desc">ಹೆಸರು (ಹ-ಅ)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-3 sm:mb-4">
          <p className="text-sm sm:text-base text-gray-600">
            {filteredNewspapers.length} ಪತ್ರಿಕೆಗಳು ಕಂಡುಬಂದಿವೆ
          </p>
        </div>

        {filteredNewspapers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? 'ಯಾವುದೇ ಪತ್ರಿಕೆ ಕಂಡುಬಂದಿಲ್ಲ' : 'ಇನ್ನೂ ಯಾವುದೇ ಪತ್ರಿಕೆಗಳಿಲ್ಲ'}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'ವಿಭಿನ್ನ ಹುಡುಕಾಟ ಪದಗಳನ್ನು ಪ್ರಯತ್ನಿಸಿ'
                : 'ಪತ್ರಿಕೆಗಳು ಪ್ರಕಟವಾದಾಗ ಅವು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredNewspapers.map((newspaper) => (
              <div key={newspaper.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-3 aspect-h-4">
                  <img
                    src={newspaper.previewImage}
                    alt={newspaper.name}
                    className="w-full h-48 sm:h-64 object-cover"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-newspaper-red rounded-full mr-2"></div>
                    <span className="text-xs sm:text-sm text-gray-600">{formatDate(newspaper.date)}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 truncate text-sm sm:text-base">{newspaper.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    ಗಾತ್ರ: {newspaper.width} × {newspaper.height}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link
                      to={`/newspaper/${newspaper.id}`}
                      className="flex-1 bg-newspaper-blue text-white text-center py-2 px-3 sm:px-4 rounded-md hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                    >
                      ಓದಿ
                    </Link>
                    <a
                      href={newspaper.pdfData}
                      download={newspaper.name}
                      className="flex-1 border border-newspaper-blue text-newspaper-blue text-center py-2 px-3 sm:px-4 rounded-md hover:bg-blue-50 transition-colors text-xs sm:text-sm"
                    >
                      ಡೌನ್ಲೋಡ್
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Archive;