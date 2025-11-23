import React, { useState, useEffect } from 'react';
import { getClickableAreas } from '../utils/localStorage';

const NewspaperViewer = ({ newspaper }) => {
  const [areas, setAreas] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (newspaper) {
      const clickableAreas = getClickableAreas(newspaper.id);
      setAreas(clickableAreas);
    }
  }, [newspaper]);

  const handleAreaClick = (area) => {
    if (area.title || area.content) {
      setSelectedNews(area);
    }
  };

  const closeNewsModal = () => {
    setSelectedNews(null);
  };

  const nextPage = () => {
    if (newspaper.pages && currentPage < newspaper.totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getCurrentPageImage = () => {
    if (newspaper.pages && newspaper.pages[currentPage]) {
      return newspaper.pages[currentPage].imageUrl;
    }
    return newspaper.previewImage;
  };

  if (!newspaper) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-500 mb-4">
          <svg className="mx-auto h-16 w-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">ಇಂದಿನ ಪತ್ರಿಕೆ ಲಭ್ಯವಿಲ್ಲ</h3>
        <p className="text-gray-600">ದಯವಿಟ್ಟು ನಂತರ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಆರ್ಕೈವ್ ಪರಿಶೀಲಿಸಿ</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="mb-3 sm:mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-newspaper-blue mb-1 sm:mb-2">ಇಂದಿನ ಪತ್ರಿಕೆ</h2>
        <p className="text-sm sm:text-base text-gray-600">{new Date(newspaper.date).toLocaleDateString('kn-IN')}</p>
      </div>
      
      <div className="relative inline-block w-full">
        <img
          src={getCurrentPageImage()}
          alt={`Newspaper page ${currentPage + 1}`}
          className="w-full h-auto border border-gray-300 rounded-lg shadow-sm"
        />
        
        {areas.filter(area => area.pageNumber === currentPage + 1).map(area => (
          <div
            key={area.id}
            className="absolute cursor-pointer hover:bg-blue-200 hover:bg-opacity-30 transition-colors border-2 border-transparent hover:border-blue-400"
            style={{
              left: area.x,
              top: area.y,
              width: Math.abs(area.width),
              height: Math.abs(area.height)
            }}
            onClick={() => handleAreaClick(area)}
            title={area.title || 'ಸುದ್ದಿ ಓದಲು ಕ್ಲಿಕ್ ಮಾಡಿ'}
          />
        ))}
      </div>

      {/* Page Navigation */}
      {newspaper.pages && newspaper.totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← ಹಿಂದಿನ ಪುಟ
          </button>
          
          <div className="text-sm text-gray-600">
            ಪುಟ {currentPage + 1} / {newspaper.totalPages}
          </div>
          
          <button
            onClick={nextPage}
            disabled={currentPage === newspaper.totalPages - 1}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ಮುಂದಿನ ಪುಟ →
          </button>
        </div>
      )}

      {/* News Modal */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-newspaper-blue">{selectedNews.title}</h3>
              <button
                onClick={closeNewsModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            {selectedNews.imageUrl && (
              <div className="mb-4">
                <img
                  src={selectedNews.imageUrl}
                  alt={selectedNews.title}
                  className="w-full h-auto rounded-lg"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
            
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {selectedNews.content}
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={closeNewsModal}
                className="bg-newspaper-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                ಮುಚ್ಚಿಸಿ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewspaperViewer;