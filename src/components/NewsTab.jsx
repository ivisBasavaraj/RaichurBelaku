import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNewspapers, getClickableAreas } from '../utils/hybridStorage';

const NewsTab = () => {
  const { newspaperId, areaId } = useParams();
  const navigate = useNavigate();
  const [newspaper, setNewspaper] = useState(null);
  const [area, setArea] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNewsContent = () => {
      try {
        const newspapers = getNewspapers();
        const currentNewspaper = newspapers.find(n => n.id === newspaperId);
        
        if (!currentNewspaper) {
          setLoading(false);
          return;
        }
        
        const areas = getClickableAreas(newspaperId);
        const currentArea = areas.find(a => a.id === areaId);
        
        if (!currentArea) {
          setLoading(false);
          return;
        }
        
        setNewspaper(currentNewspaper);
        setArea(currentArea);
        setLoading(false);
      } catch (error) {
        console.error('Error loading news content:', error);
        setLoading(false);
      }
    };

    loadNewsContent();
  }, [newspaperId, areaId]);

  const handleBackToNewspaper = () => {
    navigate('/today');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-newspaper-blue mx-auto mb-4"></div>
          <p className="text-gray-600">ಲೋಡ್ ಆಗುತ್ತಿದೆ...</p>
        </div>
      </div>
    );
  }

  if (!area || !newspaper) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">ಸುದ್ದಿ ಲಭ್ಯವಿಲ್ಲ</h2>
          <button
            onClick={handleBackToNewspaper}
            className="bg-newspaper-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ಪತ್ರಿಕೆಗೆ ಹಿಂತಿರುಗಿ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToNewspaper}
              className="flex items-center text-newspaper-blue hover:text-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              ಪತ್ರಿಕೆಗೆ ಹಿಂತಿರುಗಿ
            </button>
            <div className="text-sm text-gray-600">
              {new Date(newspaper.date).toLocaleDateString('kn-IN')}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="border-l-4 border-newspaper-red pl-4 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {area.title || 'ಸುದ್ದಿ'}
              </h1>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-6 pb-4 border-b border-gray-200">
              <span>ರಾಯಚೂರು ಬೆಳಕು</span>
            </div>
            
            {area.imageUrl && (
              <div className="mb-6">
                <img
                  src={area.imageUrl}
                  alt={area.title}
                  className="w-full h-auto rounded-lg shadow-sm"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
            
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
              {area.content || 'ಈ ಸುದ್ದಿಗೆ ವಿಷಯ ಸೇರಿಸಲಾಗಿಲ್ಲ.'}
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={handleBackToNewspaper}
            className="bg-newspaper-blue text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            ಪತ್ರಿಕೆಗೆ ಹಿಂತಿರುಗಿ
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsTab;