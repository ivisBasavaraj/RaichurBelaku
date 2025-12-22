import { db } from './firebase.js';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  updateDoc,
  query,
  orderBy 
} from 'firebase/firestore';

// Collections
const NEWSPAPERS_COLLECTION = 'newspapers';
const SETTINGS_COLLECTION = 'settings';
const TODAY_DOC = 'todaysNewspaper';

// Save newspaper
export const saveNewspaper = async (newspaper, pdfFile = null) => {
  try {
    console.log('Saving newspaper to Firestore:', newspaper.name);
    
    // Convert PDF to base64 if provided
    if (pdfFile) {
      const reader = new FileReader();
      const pdfData = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(pdfFile);
      });
      newspaper.pdfData = pdfData;
    }
    
    // Save to Firestore
    const docRef = doc(db, NEWSPAPERS_COLLECTION, newspaper.id);
    await setDoc(docRef, {
      ...newspaper,
      updatedAt: new Date().toISOString()
    });
    
    console.log('Newspaper saved successfully');
    return newspaper.id;
  } catch (error) {
    console.error('Error saving newspaper:', error);
    throw error;
  }
};

// Get all newspapers
export const getNewspapers = async () => {
  try {
    const q = query(collection(db, NEWSPAPERS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting newspapers:', error);
    return [];
  }
};

// Get newspaper by ID
export const getNewspaperById = async (id) => {
  try {
    const docRef = doc(db, NEWSPAPERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error('Error getting newspaper:', error);
    return null;
  }
};

// Delete newspaper
export const deleteNewspaper = async (id) => {
  try {
    // Delete from Firestore
    await deleteDoc(doc(db, NEWSPAPERS_COLLECTION, id));
    
    // Clear from today's newspaper if it's the current one
    const todaysNewspaper = await getTodaysNewspaper();
    if (todaysNewspaper && todaysNewspaper.id === id) {
      await setDoc(doc(db, SETTINGS_COLLECTION, TODAY_DOC), { newspaperId: null });
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting newspaper:', error);
    return false;
  }
};

// Save clickable areas
export const saveClickableAreas = async (newspaperId, areas) => {
  try {
    const docRef = doc(db, NEWSPAPERS_COLLECTION, newspaperId);
    await updateDoc(docRef, { 
      areas: areas,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error saving areas:', error);
    return false;
  }
};

// Get clickable areas
export const getClickableAreas = async (newspaperId) => {
  try {
    const newspaper = await getNewspaperById(newspaperId);
    return newspaper?.areas || [];
  } catch (error) {
    console.error('Error getting areas:', error);
    return [];
  }
};

// Get today's newspaper
export const getTodaysNewspaper = async () => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, TODAY_DOC);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().newspaperId) {
      return await getNewspaperById(docSnap.data().newspaperId);
    }
    return null;
  } catch (error) {
    console.error('Error getting today\'s newspaper:', error);
    return null;
  }
};

// Set today's newspaper
export const setTodaysNewspaper = async (newspaper) => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, TODAY_DOC);
    await setDoc(docRef, { 
      newspaperId: newspaper.id,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error setting today\'s newspaper:', error);
    return false;
  }
};

// Publish newspaper as today's edition
export const publishToday = async (newspaperId) => {
  try {
    const newspaper = await getNewspaperById(newspaperId);
    if (newspaper) {
      await setTodaysNewspaper(newspaper);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error publishing newspaper:', error);
    return false;
  }
};

// Check storage status
export const getStorageStatus = () => {
  return {
    usingFirebase: true,
    storageType: 'Firestore Database Only'
  };
};