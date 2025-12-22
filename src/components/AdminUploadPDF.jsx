import React, { useState } from 'react';
import { convertAllPDFPagesToImages, savePDFFile } from '../utils/pdfUtils';
import { saveNewspaper, getStorageStatus } from '../utils/hybridStorage';

const AdminUploadPDF = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      alert('ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ PDF ಫೈಲ್ ಅನ್ನು ಆಯ್ಕೆ ಮಾಡಿ');
      return;
    }
    
    if (file.size > 50 * 1024 * 1024) {
      alert('PDF ಫೈಲ್ ತುಂಬಾ ದೊಡ್ಡದಾಗಿದೆ. ದಯವಿಟ್ಟು 50MB ಕ್ಕಿಂತ ಚಿಕ್ಕ ಫೈಲ್ ಆಯ್ಕೆ ಮಾಡಿ.');
      return;
    }

    setUploading(true);
    
    try {
      console.log('Processing and saving PDF:', file.name);
      
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
        areas: []
      };
      
      // Auto-save immediately
      const savedId = await saveNewspaper(newspaper, file);
      const savedNewspaper = { ...newspaper, id: savedId };
      
      // Reset form
      const fileInput = document.getElementById('pdf-upload');
      if (fileInput) fileInput.value = '';
      
      onUploadSuccess(savedNewspaper);
      
      const storageStatus = await getStorageStatus();
      alert(`ಪತ್ರಿಕೆ ಯಶಸ್ವಿಯಾಗಿ ಅಪ್ಲೋಡ್ ಆಗಿದೆ! (${storageStatus.storageType})`);
    } catch (error) {
      console.error('Upload error:', error);
      alert('PDF ಅಪ್ಲೋಡ್ ಮಾಡುವಲ್ಲಿ ದೋಷ ಸಂಭವಿಸಿದೆ');
    } finally {
      setUploading(false);
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
    </div>
  );
};

export default AdminUploadPDF;