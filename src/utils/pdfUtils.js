import * as pdfjsLib from 'pdfjs-dist';

// Set worker source with fallback
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
} catch (error) {
  console.error('PDF.js worker setup error:', error);
}



export const convertPDFToImage = async (pdfFile) => {
  try {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const page = await pdf.getPage(1);
    
    // High quality scale
    const scale = 2.0;
    const viewport = page.getViewport({ scale });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    
    await page.render(renderContext).promise;
    
    // High quality
    return {
      imageUrl: canvas.toDataURL('image/jpeg', 0.95),
      width: viewport.width,
      height: viewport.height
    };
  } catch (error) {
    console.error('Error converting PDF to image:', error);
    throw error;
  }
};

export const convertAllPDFPagesToImages = async (pdfFile) => {
  try {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const numPages = pdf.numPages;
    const pages = [];
    
    // Process all pages
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      
      // High quality scale
      const scale = 2.0;
      
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
      
      // High quality
      pages.push({
        pageNumber: pageNum,
        imageUrl: canvas.toDataURL('image/jpeg', 0.95),
        width: viewport.width,
        height: viewport.height
      });
    }
    
    return {
      pages,
      totalPages: numPages,
      actualPages: numPages,
      previewImage: pages[0].imageUrl,
      width: pages[0].width,
      height: pages[0].height
    };
  } catch (error) {
    console.error('Error converting PDF pages to images:', error);
    throw error;
  }
};

export const savePDFFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Compress image further if needed
export const compressImage = (canvas, quality = 0.3) => {
  return canvas.toDataURL('image/jpeg', quality);
};

// Utility to estimate storage size
export const estimateStorageSize = (newspaper) => {
  try {
    const jsonString = JSON.stringify(newspaper);
    const sizeInBytes = new Blob([jsonString]).size;
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
    return { bytes: sizeInBytes, mb: sizeInMB };
  } catch (error) {
    console.error('Error estimating size:', error);
    return { bytes: 0, mb: '0.00' };
  }
};

