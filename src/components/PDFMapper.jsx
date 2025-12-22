import React, { useState, useRef, useEffect } from 'react';
import { saveClickableAreas, getClickableAreas } from '../utils/hybridStorage';

const PDFMapper = ({ newspaper, onNavigateToManage, onAreasSaved, onPublishToday }) => {
  const [areas, setAreas] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentArea, setCurrentArea] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedArea, setSelectedArea] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const imageRef = useRef(null);

  useEffect(() => {
    const loadAreas = async () => {
      if (newspaper) {
        try {
          const savedAreas = await getClickableAreas(newspaper.id);
          setAreas(savedAreas);
        } catch (error) {
          console.error('Error loading areas:', error);
          setAreas([]);
        }
      }
    };
    
    loadAreas();
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
        x: Math.min(currentArea.x, currentArea.x + currentArea.width),
        y: Math.min(currentArea.y, currentArea.y + currentArea.height),
        width: Math.abs(currentArea.width),
        height: Math.abs(currentArea.height),
        title: `ಸುದ್ದಿ ${areas.filter(a => a.pageNumber === currentPage + 1).length + 1}`,
        content: 'ಈ ಪ್ರದೇಶದ ವಿವರಗಳು ಚಿತ್ರದಲ್ಲಿ ಲಭ್ಯವಿದೆ.',
        imageUrl: '',
        pageNumber: currentPage + 1
      };
      
      console.log('Adding new area:', newArea);
      setAreas(prev => [...prev, newArea]);
    }
    setCurrentArea(null);
    setIsDrawing(false);
  };

  const deleteArea = (areaId) => {
    const updatedAreas = areas.filter(area => area.id !== areaId);
    setAreas(updatedAreas);
  };

  const handleAreaClick = (area) => {
    setSelectedArea(area);
  };

  const handleSaveAll = async () => {
    if (areas.length === 0) {
      alert('ಉಳಿಸಲು ಪ್ರದೇಶಗಳಿಲ್ಲ. ಮುಂದೆ ಪ್ರದೇಶಗಳನ್ನು ಮ್ಯಾಪ್ ಮಾಡಿ.');
      return;
    }

    setIsSaving(true);
    console.log('Saving areas for newspaper:', newspaper.id, 'Areas count:', areas.length);
    console.log('Areas data:', areas);
    
    try {
      // Validate areas before saving
      const validAreas = areas.filter(area => 
        area.id && 
        typeof area.x === 'number' && 
        typeof area.y === 'number' && 
        typeof area.width === 'number' && 
        typeof area.height === 'number' &&
        Math.abs(area.width) > 10 && 
        Math.abs(area.height) > 10
      );
      
      console.log('Valid areas count:', validAreas.length);
      
      if (validAreas.length === 0) {
        alert('ಮಾನ್ಯವಾದ ಪ್ರದೇಶಗಳಿಲ್ಲ. ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ.');
        setIsSaving(false);
        return;
      }
      
      const success = await saveClickableAreas(newspaper.id, validAreas);
      console.log('Save areas result:', success);
      
      if (success) {
        alert(`${validAreas.length} ಪ್ರದೇಶಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!`);
        
        // Update local state with saved areas
        setAreas(validAreas);
        
        // Call refresh callback
        if (onAreasSaved) {
          console.log('Calling onAreasSaved callback');
          onAreasSaved();
        }
      } else {
        alert('ಪ್ರದೇಶಗಳನ್ನು ಉಳಿಸಲು ದೋಷ ಸಂಭವಿಸಿದೆ!');
      }
    } catch (error) {
      console.error('Error saving areas:', error);
      let errorMessage = 'ಪ್ರದೇಶಗಳನ್ನು ಉಳಿಸಲು ದೋಷ ಸಂಭವಿಸಿದೆ!';
      
      if (error.message?.includes('network')) {
        errorMessage += '\nನೆಟ್ವರ್ಕ್ ಸಮಸ್ಯೆ. ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಪರಿಶೀಲಿಸಿ.';
      }
      
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
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
        {/* Save and Publish Workflow */}
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900 mb-3">ಪ್ರದೇಶ ಮ್ಯಾಪಿಂಗ್ ನಿಯಂತ್ರಣ</h3>
          
          <div className="mb-3">
            <div className="text-sm text-blue-800">
              ಒಟ್ಟು ಪ್ರದೇಶಗಳು: {areas.length} | ಈ ಪುಟದಲ್ಲಿ: {areas.filter(area => area.pageNumber === currentPage + 1).length}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSaveAll}
              disabled={isSaving || areas.length === 0}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  ಉಳಿಸಲಾಗುತ್ತಿದೆ...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  ಪ್ರದೇಶಗಳನ್ನು ಉಳಿಸಿ ({areas.length})
                </>
              )}
            </button>
            
            {areas.length > 0 && (
              <>
                <button
                  onClick={async () => {
                    if (window.confirm('ಈ ಪತ್ರಿಕೆಯನ್ನು ಇಂದಿನ ಪತ್ರಿಕೆಯಾಗಿ ಪ್ರಕಟಿಸಬೇಕೇ?')) {
                      if (onPublishToday) {
                        await onPublishToday(newspaper.id);
                      }
                    }
                  }}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  ಇಂದಿನ ಪತ್ರಿಕೆಯಾಗಿ ಪ್ರಕಟಿಸಿ
                </button>
                
                <button
                  onClick={() => onNavigateToManage && onNavigateToManage()}
                  className="bg-newspaper-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  ಪತ್ರಿಕೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ
                </button>
              </>
            )}
          </div>
          
          <p className="text-sm text-blue-700 mt-2">
            {areas.length === 0 
              ? 'ಮುಂದೆ ಪ್ರದೇಶಗಳನ್ನು ಮ್ಯಾಪ್ ಮಾಡಿ, ಅನಂತರ ಉಳಿಸಿ'
              : 'ಮುಂದೆ ಪ್ರದೇಶಗಳನ್ನು ಉಳಿಸಿ, ಅನಂತರ ಪ್ರಕಟಿಸಲು ಹೋಗಿ'
            }
          </p>
        </div>
        
        <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row gap-2">
          <div className="text-xs sm:text-sm text-gray-600 flex items-center">
            ಈ ಪುಟದಲ್ಲಿ: {areas.filter(area => area.pageNumber === currentPage + 1).length} ಪ್ರದೇಶಗಳು
          </div>
        </div>
        
        <div className="text-xs sm:text-sm text-gray-600 space-y-1">
          <p>• ಮೌಸ್ ಡ್ರ್ಯಾಗ್ ಮಾಡಿ ಪ್ರದೇಶವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ</p>
          <p>• ಪ್ರದೇಶವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ವಿಷಯ ಸೇರಿಸಿ</p>
          <p>• ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಪ್ರದೇಶಗಳನ್ನು ಅಳಿಸಲು × ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ</p>
          <p>• ಪ್ರತಿ ಪುಟದ ಬದಲಾವಣೆಗಳು ಸ್ವಯಂಚಲಿತವಾಗಿ ಉಳಿಸಲಾಗುತ್ತವೆ</p>
        </div>
      </div>


    </div>
  );
};



export default PDFMapper;