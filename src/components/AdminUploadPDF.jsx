import React, { useState } from 'react';
import { convertAllPDFPagesToImages, savePDFFile, estimateStorageSize } from '../utils/pdfUtils';
import { saveNewspaper, getStorageInfo } from '../utils/localStorage';

const AdminUploadPDF = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedNewspaper, setUploadedNewspaper] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [storageWarning, setStorageWarning] = useState('');

  const handleFileUpload = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      alert('ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ PDF ಫೈಲ್ ಅನ್ನು ಆಯ್ಕೆ ಮಾಡಿ');
      return;
    }
    


    setUploading(true);
    try {
      const [pagesData, pdfData] = await Promise.all([
        convertAllPDFPagesToImages(file),
        savePDFFile(file)
      ]);

      const newspaper = {
        id: Date.now().toString(),
        name: file.name,
        date: new Date().toISOString(),
        pdfData,
        pages: pagesData.pages,
        totalPages: pagesData.totalPages,
        actualPages: pagesData.actualPages,
        previewImage: pagesData.previewImage,
        width: pagesData.width,
        height: pagesData.height,
        areas: [] // Initialize empty areas array
      };

      // Show size estimate
      const sizeEstimate = estimateStorageSize(newspaper);
      console.log(`Newspaper size estimate: ${sizeEstimate.mb} MB`);
      
      setUploadedNewspaper(newspaper);
      setCurrentPage(0);
      
      let message = 'PDF ಯಶಸ್ವಿಯಾಗಿ ಅಪ್ಲೋಡ್ ಆಗಿದೆ!';
      if (pagesData.actualPages > pagesData.totalPages) {
        message += `\nಗಮನಿಸಿ: ${pagesData.actualPages} ಪುಟಗಳಿಂದ ${pagesData.totalPages} ಪುಟಗಳನ್ನು ಮಾತ್ರ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗಿದೆ.`;
      }
      alert(message);
    } catch (error) {
      console.error('Upload error:', error);
      alert('PDF ಅಪ್ಲೋಡ್ ಮಾಡುವಲ್ಲಿ ದೋಷ ಸಂಭವಿಸಿದೆ');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveNewspaper = () => {
    if (uploadedNewspaper) {
      try {
        localStorage.setItem('newspapers_v2', JSON.stringify([{
          id: uploadedNewspaper.id,
          name: uploadedNewspaper.name,
          date: uploadedNewspaper.date,
          pages: uploadedNewspaper.pages,
          totalPages: uploadedNewspaper.totalPages,
          previewImage: uploadedNewspaper.previewImage,
          width: uploadedNewspaper.width,
          height: uploadedNewspaper.height,
          areas: []
        }]));
        
        onUploadSuccess(uploadedNewspaper);
        setUploadedNewspaper(null);
        setCurrentPage(0);
        setStorageWarning('');
        alert('ಪತ್ರಿಕೆ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!');
      } catch (error) {
        console.error('Save error:', error);
        alert('ಪತ್ರಿಕೆ ಉಳಿಸಲು ದೋಷ ಸಂಭವಿಸಿದೆ!');
      }
    }
  };

  const nextPage = () => {
    if (currentPage < uploadedNewspaper.totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  const handleDivClick = () => {
    document.getElementById('pdf-upload').click();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-newspaper-blue mb-3 sm:mb-4">PDF ಅಪ್ಲೋಡ್ ಮಾಡಿ</h2>
      
      {!uploadedNewspaper ? (
        <div
          className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors cursor-pointer ${
            dragOver 
              ? 'border-newspaper-blue bg-blue-50' 
              : 'border-gray-300 hover:border-newspaper-blue active:border-newspaper-blue'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={handleDivClick}
          onTouchStart={() => setDragOver(true)}
          onTouchEnd={() => setDragOver(false)}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-newspaper-blue mb-4"></div>
              <p className="text-gray-600">PDF ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...</p>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-base sm:text-lg text-gray-600 mb-2">PDF ಫೈಲ್ ಅನ್ನು ಇಲ್ಲಿ ಟ್ಯಾಪ್ ಮಾಡಿ</p>
              <p className="text-sm text-gray-500 mb-4">ಅಥವಾ ಕೆಳಗಿನ ಬಟನ್ ಒತ್ತಿ</p>
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="pdf-upload"
              />
              <div className="bg-newspaper-blue text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg cursor-pointer hover:bg-blue-700 active:bg-blue-800 transition-colors inline-block text-sm sm:text-base">
                ಫೈಲ್ ಆಯ್ಕೆ ಮಾಡಿ
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-3 sm:mb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">{uploadedNewspaper.name}</h3>
              <div className="text-xs sm:text-sm text-gray-600">
                ಪುಟ {currentPage + 1} / {uploadedNewspaper.totalPages}
                {uploadedNewspaper.actualPages > uploadedNewspaper.totalPages && (
                  <span className="text-orange-600 ml-2">
                    (ಒಟ್ಟು: {uploadedNewspaper.actualPages})
                  </span>
                )}
              </div>
            </div>
            

            
            <div className="text-xs text-gray-500">
              ಅನುಮಾನಿತ ಗಾತ್ರ: {estimateStorageSize(uploadedNewspaper).mb} MB
            </div>
          </div>
          
          <div className="border rounded-lg p-2 sm:p-4 mb-3 sm:mb-4">
            <img
              src={uploadedNewspaper.pages[currentPage].imageUrl}
              alt={`Page ${currentPage + 1}`}
              className="w-full h-auto mx-auto"
              style={{ maxHeight: '400px' }}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="w-full sm:w-auto bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              ← ಹಿಂದಿನ ಪುಟ
            </button>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  setUploadedNewspaper(null);
                  setCurrentPage(0);
                  setStorageWarning('');
                }}
                className="bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-600 text-sm sm:text-base"
              >
                ರದ್ದುಮಾಡಿ
              </button>
              <button
                onClick={handleSaveNewspaper}
                className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 text-sm sm:text-base"
              >
                ಉಳಿಸಿ
              </button>
            </div>
            
            <button
              onClick={nextPage}
              disabled={currentPage === uploadedNewspaper.totalPages - 1}
              className="w-full sm:w-auto bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              ಮುಂದಿನ ಪುಟ →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUploadPDF;