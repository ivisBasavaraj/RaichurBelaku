import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  orderBy, 
  where 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './firebase';

// Collections
const NEWSPAPERS_COLLECTION = 'newspapers';
const SETTINGS_COLLECTION = 'settings';

// Upload PDF file to Firebase Storage
export const uploadPDFToStorage = async (file, newspaperId) => {
  try {
    const storageRef = ref(storage, `pdfs/${newspaperId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
};

// Upload image to Firebase Storage
export const uploadImageToStorage = async (imageBlob, newspaperId, pageNumber) => {
  try {
    const storageRef = ref(storage, `images/${newspaperId}/page-${pageNumber}.jpg`);
    const snapshot = await uploadBytes(storageRef, imageBlob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Save newspaper to Firestore
export const saveNewspaperToFirestore = async (newspaper) => {
  try {
    console.log('Saving newspaper to Firestore:', newspaper.name);
    
    // Prepare newspaper data for Firestore
    const newspaperData = {
      name: newspaper.name,
      date: newspaper.date,
      totalPages: newspaper.totalPages,
      actualPages: newspaper.actualPages,
      width: newspaper.width,
      height: newspaper.height,
      areas: newspaper.areas || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // If newspaper has an ID, update existing document
    if (newspaper.id && newspaper.id !== Date.now().toString()) {
      const docRef = doc(db, NEWSPAPERS_COLLECTION, newspaper.id);
      await updateDoc(docRef, {
        ...newspaperData,
        updatedAt: new Date()
      });
      console.log('Updated newspaper:', newspaper.id);
      return newspaper.id;
    } else {
      // Create new document
      const docRef = await addDoc(collection(db, NEWSPAPERS_COLLECTION), newspaperData);
      console.log('Created newspaper:', docRef.id);
      return docRef.id;
    }
  } catch (error) {
    console.error('Error saving newspaper:', error);
    throw error;
  }
};

// Get all newspapers from Firestore
export const getNewspapersFromFirestore = async () => {
  try {
    const q = query(collection(db, NEWSPAPERS_COLLECTION), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const newspapers = [];
    querySnapshot.forEach((doc) => {
      newspapers.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('Retrieved newspapers from Firestore:', newspapers.length);
    return newspapers;
  } catch (error) {
    console.error('Error getting newspapers:', error);
    throw error;
  }
};

// Get single newspaper by ID
export const getNewspaperFromFirestore = async (id) => {
  try {
    const docRef = doc(db, NEWSPAPERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      console.log('No newspaper found with ID:', id);
      return null;
    }
  } catch (error) {
    console.error('Error getting newspaper:', error);
    throw error;
  }
};

// Delete newspaper from Firestore
export const deleteNewspaperFromFirestore = async (id) => {
  try {
    await deleteDoc(doc(db, NEWSPAPERS_COLLECTION, id));
    console.log('Deleted newspaper:', id);
    return true;
  } catch (error) {
    console.error('Error deleting newspaper:', error);
    throw error;
  }
};

// Update clickable areas for a newspaper
export const updateNewspaperAreas = async (newspaperId, areas) => {
  try {
    const docRef = doc(db, NEWSPAPERS_COLLECTION, newspaperId);
    await updateDoc(docRef, {
      areas: areas,
      updatedAt: new Date()
    });
    console.log('Updated areas for newspaper:', newspaperId);
    return true;
  } catch (error) {
    console.error('Error updating areas:', error);
    throw error;
  }
};

// Get today's newspaper setting
export const getTodaysNewspaperFromFirestore = async () => {
  try {
    const q = query(collection(db, SETTINGS_COLLECTION), where('key', '==', 'todaysNewspaper'));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const todaysSetting = doc.data();
      
      if (todaysSetting.newspaperId) {
        return await getNewspaperFromFirestore(todaysSetting.newspaperId);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting today\'s newspaper:', error);
    throw error;
  }
};

// Set today's newspaper
export const setTodaysNewspaperInFirestore = async (newspaperId) => {
  try {
    const q = query(collection(db, SETTINGS_COLLECTION), where('key', '==', 'todaysNewspaper'));
    const querySnapshot = await getDocs(q);
    
    const settingData = {
      key: 'todaysNewspaper',
      newspaperId: newspaperId,
      updatedAt: new Date()
    };
    
    if (!querySnapshot.empty) {
      // Update existing setting
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, settingData);
    } else {
      // Create new setting
      await addDoc(collection(db, SETTINGS_COLLECTION), settingData);
    }
    
    console.log('Set today\'s newspaper:', newspaperId);
    return true;
  } catch (error) {
    console.error('Error setting today\'s newspaper:', error);
    throw error;
  }
};

// Delete files from Storage when newspaper is deleted
export const deleteNewspaperFiles = async (newspaperId) => {
  try {
    // Delete PDF files
    const pdfRef = ref(storage, `pdfs/${newspaperId}`);
    await deleteObject(pdfRef).catch(() => {}); // Ignore if doesn't exist
    
    // Delete image files
    const imageRef = ref(storage, `images/${newspaperId}`);
    await deleteObject(imageRef).catch(() => {}); // Ignore if doesn't exist
    
    console.log('Deleted files for newspaper:', newspaperId);
  } catch (error) {
    console.error('Error deleting files:', error);
    // Don't throw error as this is cleanup
  }
};