import {
  saveNewspaperToSupabase,
  getNewspapersFromSupabase,
  getNewspaperFromSupabase,
  deleteNewspaperFromSupabase,
  updateNewspaperAreas,
  getTodaysNewspaperFromSupabase,
  setTodaysNewspaperInSupabase,
  uploadPDFToStorage,
  uploadImageToStorage
} from './supabaseStorage';





// Import supabase client
import { supabase } from './firebase';





// Process images for storage
const processImagesForStorage = async (pages, newspaperId) => {
  const processedPages = [];
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    try {
      // Convert data URL to blob
      const response = await fetch(page.imageUrl);
      const blob = await response.blob();
      
      // Upload to Supabase Storage
      const downloadURL = await uploadImageToStorage(blob, newspaperId, page.pageNumber);
      
      processedPages.push({
        ...page,
        imageUrl: downloadURL
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      // Fallback to original data URL
      processedPages.push(page);
    }
  }
  return processedPages;
};

// Save newspaper to Supabase
export const saveNewspaper = async (newspaper, pdfFile = null) => {
  try {
    console.log('Saving newspaper to Supabase:', newspaper.name);
    
    let processedNewspaper = { ...newspaper };
    
    // Upload PDF if provided
    if (pdfFile) {
      try {
        const pdfURL = await uploadPDFToStorage(pdfFile, newspaper.id);
        processedNewspaper.pdfUrl = pdfURL;
      } catch (error) {
        console.error('PDF upload failed:', error);
      }
    }
    
    // Process and upload images
    if (newspaper.pages) {
      processedNewspaper.pages = await processImagesForStorage(newspaper.pages, newspaper.id);
    }
    
    // Keep PDF URL for access
    if (processedNewspaper.pdfData) {
      processedNewspaper.pdfUrl = processedNewspaper.pdfData;
      delete processedNewspaper.pdfData;
    }
    
    const id = await saveNewspaperToSupabase(processedNewspaper);
    return id;
  } catch (error) {
    console.error('Error saving to Supabase:', error);
    throw error;
  }
};

// Get newspapers from Supabase
export const getNewspapers = async () => {
  try {
    const newspapers = await getNewspapersFromSupabase();
    console.log('Retrieved newspapers from Supabase:', newspapers.length);
    return newspapers;
  } catch (error) {
    console.error('Error getting newspapers from Supabase:', error);
    return [];
  }
};

// Get newspaper by ID from Supabase
export const getNewspaperById = async (id) => {
  try {
    return await getNewspaperFromSupabase(id);
  } catch (error) {
    console.error('Error getting newspaper by ID from Supabase:', error);
    return null;
  }
};

// Delete newspaper from Supabase
export const deleteNewspaper = async (id) => {
  try {
    await deleteNewspaperFromSupabase(id);
    return true;
  } catch (error) {
    console.error('Error deleting newspaper from Supabase:', error);
    return false;
  }
};

// Save clickable areas to Supabase
export const saveClickableAreas = async (newspaperId, areas) => {
  try {
    return await updateNewspaperAreas(newspaperId, areas);
  } catch (error) {
    console.error('Error saving areas to Supabase:', error);
    return false;
  }
};

// Get today's newspaper from Supabase
export const getTodaysNewspaper = async () => {
  try {
    return await getTodaysNewspaperFromSupabase();
  } catch (error) {
    console.error('Error getting today\'s newspaper from Supabase:', error);
    return null;
  }
};

// Set today's newspaper in Supabase
export const setTodaysNewspaper = async (newspaper) => {
  try {
    if (typeof newspaper === 'object' && newspaper.id) {
      return await setTodaysNewspaperInSupabase(newspaper.id);
    } else {
      return await setTodaysNewspaperInSupabase(newspaper);
    }
  } catch (error) {
    console.error('Error setting today\'s newspaper in Supabase:', error);
    return false;
  }
};

// Get clickable areas (same as getNewspaperById since areas are stored with newspaper)
export const getClickableAreas = async (newspaperId) => {
  try {
    const newspaper = await getNewspaperById(newspaperId);
    return newspaper?.areas || [];
  } catch (error) {
    console.error('Error getting clickable areas:', error);
    return [];
  }
};

// Publish newspaper as today's edition
export const publishToday = async (newspaperId) => {
  try {
    return await setTodaysNewspaper(newspaperId);
  } catch (error) {
    console.error('Error publishing newspaper:', error);
    return false;
  }
};

// Check storage status
export const getStorageStatus = () => {
  return {
    usingFirebase: true,
    storageType: 'Supabase Cloud Storage'
  };
};