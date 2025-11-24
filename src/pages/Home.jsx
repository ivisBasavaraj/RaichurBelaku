import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTodaysNewspaper } from '../utils/localStorage';

const Home = () => {
  const [todaysNewspaper, setTodaysNewspaper] = useState(null);
  
  useEffect(() => {
    const loadTodaysNewspaper = () => {
      const newspaper = getTodaysNewspaper();
      console.log('Loading today\'s newspaper:', newspaper);
      setTodaysNewspaper(newspaper);
    };
    
    loadTodaysNewspaper();
    
    // Refresh every 10 seconds to catch new publications
    const interval = setInterval(loadTodaysNewspaper, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-newspaper-blue to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <img 
              src="/logo.jpg" 
              alt="ರಾಯಚೂರು ಬೆಳಕು Logo" 
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover mx-auto mb-6"
            />
            <h1 className="text-4xl md:text-6xl font-bold mb-4">ರಾಯಚೂರು ಬೆಳಕು</h1>
            <p className="text-xl md:text-2xl mb-2">Raichuru Belku</p>
            <p className="text-lg opacity-90 mb-8">ನಿಮ್ಮ ವಿಶ್ವಾಸಾರ್ಹ ಡಿಜಿಟಲ್ ಪತ್ರಿಕೆ</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/today"
                className="bg-white text-newspaper-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                ಇಂದಿನ ಪತ್ರಿಕೆ ಓದಿ
              </Link>
              <Link
                to="/archive"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-newspaper-blue transition-colors"
              >
                ಸಂಗ್ರಹಿತ ಪತ್ರಿಕೆಗಳು ನೋಡಿ
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Newspaper Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">ಇಂದಿನ ಮುಖ್ಯ ಸುದ್ದಿಗಳು</h2>
          <div className="w-24 h-1 bg-newspaper-red mx-auto mb-4"></div>
          <button
            onClick={() => {
              const newspaper = getTodaysNewspaper();
              console.log('Manual refresh - today\'s newspaper:', newspaper);
              setTodaysNewspaper(newspaper);
            }}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            ರಿಫ್ರೆಶ್ ಮಾಡಿ
          </button>
        </div>

        {todaysNewspaper ? (
          <div className="space-y-8">
            {/* Main Newspaper Display */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={todaysNewspaper.previewImage}
                    alt="Today's newspaper"
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-newspaper-red rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">
                      {new Date(todaysNewspaper.date).toLocaleDateString('kn-IN')}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">ಇಂದಿನ ಆವೃತ್ತಿ</h3>
                  <p className="text-gray-600 mb-6">
                    ಇಂದಿನ ಎಲ್ಲಾ ಪ್ರಮುಖ ಸುದ್ದಿಗಳು, ಸ್ಥಳೀಯ ಮಾಹಿತಿ ಮತ್ತು ವಿಶೇಷ ಲೇಖನಗಳನ್ನು ಓದಿ. 
                    ಪ್ರತಿ ಸುದ್ದಿಯನ್ನು ವಿವರವಾಗಿ ತಿಳಿಯಲು ಪತ್ರಿಕೆಯ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.
                  </p>
                  <Link
                    to="/today"
                    className="inline-flex items-center bg-newspaper-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ಪತ್ರಿಕೆ ಓದಿ
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* News Headlines Grid */}
            <TodaysHeadlines newspaper={todaysNewspaper} />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">ಇಂದಿನ ಪತ್ರಿಕೆ ಇನ್ನೂ ಪ್ರಕಟವಾಗಿಲ್ಲ</h3>
            <p className="text-gray-600">ದಯವಿಟ್ಟು ನಂತರ ಪರಿಶೀಲಿಸಿ ಅಥವಾ ಹಿಂದಿನ ಆವೃತ್ತಿಗಳನ್ನು ಆರ್ಕೈವ್‌ನಲ್ಲಿ ನೋಡಿ</p>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">ನಮ್ಮ ವೈಶಿಷ್ಟ್ಯಗಳು</h2>
            <div className="w-16 sm:w-24 h-1 bg-newspaper-red mx-auto"></div>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-newspaper-blue rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">ಡಿಜಿಟಲ್ ಪತ್ರಿಕೆ</h3>
              <p className="text-sm sm:text-base text-gray-600 px-2">ಸಂಪೂರ್ಣ ಡಿಜಿಟಲ್ ಅನುಭವದೊಂದಿಗೆ ಪತ್ರಿಕೆ ಓದಿ</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-newspaper-red rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">ಇಂಟರ್ಯಾಕ್ಟಿವ್ ಓದುವಿಕೆ</h3>
              <p className="text-sm sm:text-base text-gray-600 px-2">ಪ್ರತಿ ಸುದ್ದಿಯನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ವಿವರವಾಗಿ ಓದಿ</p>
            </div>
            
            <div className="text-center sm:col-span-2 md:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-newspaper-blue rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">ಸಂಗ್ರಹಿತ ಪತ್ರಿಕೆಗಳು</h3>
              <p className="text-sm sm:text-base text-gray-600 px-2">ಹಿಂದಿನ ಎಲ್ಲಾ ಆವೃತ್ತಿಗಳನ್ನು ಸುಲಭವಾಗಿ ಪ್ರವೇಶಿಸಿ</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">ರಾಯಚೂರು ಬೆಳಕು ಬಗ್ಗೆ</h2>
          <p className="text-sm sm:text-lg text-gray-700 leading-relaxed px-4">
            ರಾಯಚೂರು ಬೆಳಕು ಒಂದು ಆಧುನಿಕ ಡಿಜಿಟಲ್ ಪತ್ರಿಕೆಯಾಗಿದ್ದು, ಸ್ಥಳೀಯ ಸುದ್ದಿಗಳು, 
            ರಾಜ್ಯ ಮತ್ತು ರಾಷ್ಟ್ರೀಯ ಮಾಹಿತಿಗಳನ್ನು ಕನ್ನಡದಲ್ಲಿ ನಿಮಗೆ ತಲುಪಿಸುತ್ತದೆ. 
            ನಮ್ಮ ಗುರಿ ಸತ್ಯವಾದ, ನಿಖರವಾದ ಮತ್ತು ಸಮಯೋಚಿತ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸುವುದು.
          </p>
        </div>
      </div>
    </div>
  );
};

// Component to display today's news headlines
const TodaysHeadlines = ({ newspaper }) => {
  const [areas, setAreas] = React.useState([]);

  React.useEffect(() => {
    if (newspaper && newspaper.areas) {
      // Filter areas that have titles (actual news)
      const newsAreas = newspaper.areas.filter(area => area.title && area.title.trim());
      setAreas(newsAreas);
    }
  }, [newspaper]);

  if (areas.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">ಇಂದಿನ ಮುಖ್ಯ ಸುದ್ದಿಗಳು</h3>
        <Link
          to="/today"
          className="text-newspaper-blue hover:text-blue-700 text-sm font-medium"
        >
          ಎಲ್ಲಾ ಸುದ್ದಿಗಳು →
        </Link>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {areas.slice(0, 6).map((area, index) => (
          <div key={area.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-newspaper-red rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {area.title}
                </h4>
                {area.content && (
                  <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                    {area.content.substring(0, 120)}...
                  </p>
                )}
                <Link
                  to="/today"
                  className="text-xs text-newspaper-blue hover:text-blue-700 font-medium"
                >
                  ಸಂಪೂರ್ಣ ಸುದ್ದಿ ಓದಿ →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {areas.length > 6 && (
        <div className="text-center mt-6">
          <Link
            to="/today"
            className="inline-flex items-center bg-newspaper-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ಇನ್ನಷ್ಟು ಸುದ್ದಿಗಳು ({areas.length - 6})
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;