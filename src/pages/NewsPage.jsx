import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTodaysNewspaper, getNewspapers, getNewspaperById } from '../utils/hybridStorage';
import NewspaperViewer from '../components/NewspaperViewer';

const NewsPage = () => {
  const { newspaperId } = useParams();
  const [newspaper, setNewspaper] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNewspaper = async () => {
      try {
        let loadedNewspaper;
        if (newspaperId) {
          loadedNewspaper = await getNewspaperById(newspaperId);
        } else {
          loadedNewspaper = await getTodaysNewspaper();
        }
        setNewspaper(loadedNewspaper);
      } catch (error) {
        console.error('Error loading newspaper:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNewspaper();
  }, [newspaperId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-newspaper-blue mx-auto mb-4"></div>
          <p className="text-gray-600">ಪತ್ರಿಕೆ ಲೋಡ್ ಆಗುತ್ತಿದೆ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <NewspaperViewer newspaper={newspaper} />
      </div>
    </div>
  );
};

export default NewsPage;