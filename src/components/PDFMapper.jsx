import React, { useState, useRef, useEffect } from 'react';
import { saveClickableAreas, getClickableAreas } from '../utils/localStorage';

const PDFMapper = ({ newspaper }) => {
  const [areas, setAreas] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentArea, setCurrentArea] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedArea, setSelectedArea] = useState(null);
  const [showContentForm, setShowContentForm] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    if (newspaper) {
      const savedAreas = getClickableAreas(newspaper.id);
      setAreas(savedAreas);
    }
  }, [newspaper]);

  const handleMouseDown = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setCurrentArea({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentArea(prev => ({
      ...prev,
      width: x - prev.x,
      height: y - prev.y
    }));
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentArea) return;
    
    if (Math.abs(currentArea.width) > 20 && Math.abs(currentArea.height) > 20) {
      const newArea = {
        id: Date.now().toString(),
        ...currentArea,
        title: '',
        content: '',
        imageUrl: '',
        pageNumber: currentPage + 1
      };
      setAreas(prev => [...prev, newArea]);
      setSelectedArea(newArea);
      setShowContentForm(true);
    }
    setCurrentArea(null);
    setIsDrawing(false);
  };

  const deleteArea = (areaId) => {
    const updatedAreas = areas.filter(area => area.id !== areaId);
    setAreas(updatedAreas);
    if (selectedArea && selectedArea.id === areaId) {
      setSelectedArea(null);
      setShowContentForm(false);
    }
  };

  const handleAreaClick = (area) => {
    setSelectedArea(area);
    setShowContentForm(true);
  };

  const handleContentSave = (contentData) => {
    const updatedAreas = areas.map(area => 
      area.id === selectedArea.id 
        ? { ...area, ...contentData }
        : area
    );
    setAreas(updatedAreas);
    setShowContentForm(false);
    setSelectedArea(null);
  };

  const handleContentCancel = () => {
    setShowContentForm(false);
    setSelectedArea(null);
  };

  const handleSaveAll = () => {
    saveClickableAreas(newspaper.id, areas);
    alert('ಎಲ್ಲಾ ಪ್ರದೇಶಗಳನ್ನು ಉಳಿಸಲಾಗಿದೆ!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-newspaper-blue mb-3 sm:mb-4">ಕ್ಲಿಕ್ ಮಾಡಬಹುದಾದ ಪ್ರದೇಶಗಳನ್ನು ಮ್ಯಾಪ್ ಮಾಡಿ</h2>
      
      <div className="relative inline-block w-full">
        <img
          ref={imageRef}
          src={newspaper.pages ? newspaper.pages[currentPage].imageUrl : newspaper.previewImage}
          alt={`Newspaper page ${currentPage + 1}`}
          className="w-full h-auto border border-gray-300 cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          draggable={false}
        />
        
        {areas.filter(area => area.pageNumber === currentPage + 1).map(area => (
          <div
            key={area.id}
            className={`clickable-area group cursor-pointer ${
              selectedArea && selectedArea.id === area.id ? 'ring-2 ring-blue-500' : ''
            }`}
            style={{
              left: area.x,
              top: area.y,
              width: Math.abs(area.width),
              height: Math.abs(area.height)
            }}
            onClick={() => handleAreaClick(area)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteArea(area.id);
              }}
              className="absolute -top-2 -right-2 bg-newspaper-red text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              ×
            </button>
            {area.title && (
              <div className="absolute -bottom-6 left-0 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity max-w-40 truncate">
                {area.title}
              </div>
            )}
          </div>
        ))}
        
        {currentArea && (
          <div
            className="drawing-area"
            style={{
              left: currentArea.x,
              top: currentArea.y,
              width: Math.abs(currentArea.width),
              height: Math.abs(currentArea.height)
            }}
          />
        )}
      </div>

      {newspaper.pages && newspaper.totalPages > 1 && (
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="w-full sm:w-auto bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            ← ಹಿಂದಿನ ಪುಟ
          </button>
          
          <div className="text-xs sm:text-sm text-gray-600">
            ಪುಟ {currentPage + 1} / {newspaper.totalPages}
          </div>
          
          <button
            onClick={() => setCurrentPage(Math.min(newspaper.totalPages - 1, currentPage + 1))}
            disabled={currentPage === newspaper.totalPages - 1}
            className="w-full sm:w-auto bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            ಮುಂದಿನ ಪುಟ →
          </button>
        </div>
      )}

      <div className="mt-3 sm:mt-4">
        {areas.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <button
              onClick={handleSaveAll}
              className="w-full sm:w-auto bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
            >
              ಎಲ್ಲಾ ಪ್ರದೇಶಗಳನ್ನು ಉಳಿಸಿ ({areas.length})
            </button>
          </div>
        )}
        <div className="text-xs sm:text-sm text-gray-600 space-y-1">
          <p>• ಮೌಸ್ ಡ್ರ್ಯಾಗ್ ಮಾಡಿ ಪ್ರದೇಶವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ</p>
          <p>• ಪ್ರದೇಶವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ವಿಷಯ ಸೇರಿಸಿ</p>
          <p>• ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಪ್ರದೇಶಗಳನ್ನು ಅಳಿಸಲು × ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ</p>
        </div>
      </div>

      {/* Content Form Modal */}
      {showContentForm && selectedArea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-newspaper-blue mb-4">ಸುದ್ದಿ ವಿಷಯ ಸೇರಿಸಿ</h3>
            <ContentForm
              area={selectedArea}
              onSave={handleContentSave}
              onCancel={handleContentCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Content Form Component
const ContentForm = ({ area, onSave, onCancel }) => {
  const [title, setTitle] = useState(area.title || '');
  const [content, setContent] = useState(area.content || '');
  const [imageUrl, setImageUrl] = useState(area.imageUrl || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, content, imageUrl });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ಸುದ್ದಿ ಶೀರ್ಷಿಕೆ
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newspaper-blue"
          placeholder="ಸುದ್ದಿ ಶೀರ್ಷಿಕೆ ನಮೂದಿಸಿ..."
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ಸುದ್ದಿ ವಿಷಯ
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newspaper-blue"
          placeholder="ಸುದ್ದಿ ವಿಷಯ ನಮೂದಿಸಿ..."
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ಚಿತ್ರ URL (ಐಚ್ಛಿಕ)
        </label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newspaper-blue"
          placeholder="https://example.com/image.jpg"
        />
      </div>
      
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
        >
          ರದ್ದುಮಾಡಿ
        </button>
        <button
          type="submit"
          className="flex-1 bg-newspaper-blue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          ಉಳಿಸಿ
        </button>
      </div>
    </form>
  );
};

export default PDFMapper;