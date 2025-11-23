// LocalStorage utility functions with mobile support
export const saveToLocalStorage = (key, data) => {
  try {
    // Check if localStorage is available (some mobile browsers in private mode disable it)
    if (typeof Storage === 'undefined' || !window.localStorage) {
      console.warn('localStorage not available');
      return false;
    }
    
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    
    // Verify the data was actually saved (mobile browsers sometimes fail silently)
    const saved = localStorage.getItem(key);
    if (!saved) {
      throw new Error('Data not saved properly');
    }
    
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    if (error.name === 'QuotaExceededError') {
      alert('ಸ್ಟೋರೇಜ್ ಸ್ಥಳ ತುಂಬಿದೆ. ಕೆಲವು ಹಳೆಯ ಫೈಲ್ಗಳನ್ನು ಅಳಿಸಿ.');
    }
    return false;
  }
};

export const getFromLocalStorage = (key) => {
  try {
    // Check if localStorage is available
    if (typeof Storage === 'undefined' || !window.localStorage) {
      return null;
    }
    
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    // Try to recover corrupted data
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Could not remove corrupted item:', e);
    }
    return null;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

// Get storage usage info with mobile optimization
export const getStorageInfo = () => {
  try {
    if (typeof Storage === 'undefined' || !window.localStorage) {
      return { used: 0, usedMB: '0.00', available: false };
    }
    
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length;
      }
    }
    
    // Estimate available space (mobile browsers typically have 5-10MB limit)
    const estimatedLimit = 10 * 1024 * 1024; // 10MB
    const usedMB = (totalSize / (1024 * 1024)).toFixed(2);
    const availableMB = ((estimatedLimit - totalSize) / (1024 * 1024)).toFixed(2);
    
    return {
      used: totalSize,
      usedMB,
      availableMB,
      available: true
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return { used: 0, usedMB: '0.00', available: false };
  }
};

// Clear all app data
export const clearAllData = () => {
  try {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith('newspapers') || 
      key.startsWith('areas_') || 
      key === 'todaysNewspaper' ||
      key === 'adminCredentials'
    );
    keys.forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

// Specific functions for newspaper data
export const saveNewspaper = (newspaper) => {
  const newspapers = getFromLocalStorage('newspapers') || [];
  const existingIndex = newspapers.findIndex(n => n.id === newspaper.id);
  
  if (existingIndex >= 0) {
    newspapers[existingIndex] = newspaper;
  } else {
    newspapers.push(newspaper);
  }
  
  return saveToLocalStorage('newspapers', newspapers);
};

export const deleteNewspaper = (newspaperId) => {
  const newspapers = getFromLocalStorage('newspapers') || [];
  const filteredNewspapers = newspapers.filter(n => n.id !== newspaperId);
  
  // Also remove associated clickable areas
  removeFromLocalStorage(`areas_${newspaperId}`);
  
  // If this was today's newspaper, clear it
  const todaysNewspaper = getTodaysNewspaper();
  if (todaysNewspaper && todaysNewspaper.id === newspaperId) {
    removeFromLocalStorage('todaysNewspaper');
  }
  
  return saveToLocalStorage('newspapers', filteredNewspapers);
};

export const publishToday = (newspaperId) => {
  const newspapers = getNewspapers();
  const newspaper = newspapers.find(n => n.id === newspaperId);
  if (newspaper) {
    return setTodaysNewspaper(newspaper);
  }
  return false;
};

export const getNewspapers = () => {
  return getFromLocalStorage('newspapers') || [];
};

export const getNewspaperById = (id) => {
  const newspapers = getNewspapers();
  return newspapers.find(n => n.id === id) || null;
};

export const getTodaysNewspaper = () => {
  return getFromLocalStorage('todaysNewspaper') || null;
};

export const setTodaysNewspaper = (newspaper) => {
  return saveToLocalStorage('todaysNewspaper', newspaper);
};

export const saveClickableAreas = (newspaperId, areas) => {
  return saveToLocalStorage(`areas_${newspaperId}`, areas);
};

export const getClickableAreas = (newspaperId) => {
  return getFromLocalStorage(`areas_${newspaperId}`) || [];
};

export const saveAreaContent = (newspaperId, areaId, content) => {
  const areas = getClickableAreas(newspaperId);
  const areaIndex = areas.findIndex(a => a.id === areaId);
  
  if (areaIndex >= 0) {
    areas[areaIndex] = { ...areas[areaIndex], ...content };
    return saveClickableAreas(newspaperId, areas);
  }
  return false;
};

// Admin credentials
export const saveAdminCredentials = (credentials) => {
  return saveToLocalStorage('adminCredentials', credentials);
};

export const getAdminCredentials = () => {
  return getFromLocalStorage('adminCredentials');
};

// Backup and restore functions
export const createBackup = () => {
  try {
    const backup = {
      timestamp: new Date().toISOString(),
      data: {
        newspapers: getNewspapers(),
        todaysNewspaper: getTodaysNewspaper(),
        areas: {}
      }
    };
    
    // Include all clickable areas
    const newspapers = getNewspapers();
    newspapers.forEach(newspaper => {
      backup.data.areas[newspaper.id] = getClickableAreas(newspaper.id);
    });
    
    const backupString = JSON.stringify(backup);
    const blob = new Blob([backupString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `raichuru-belku-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error creating backup:', error);
    return false;
  }
};

export const restoreFromBackup = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);
        
        if (backup.data) {
          if (backup.data.newspapers) {
            saveToLocalStorage('newspapers', backup.data.newspapers);
          }
          
          if (backup.data.todaysNewspaper) {
            saveToLocalStorage('todaysNewspaper', backup.data.todaysNewspaper);
          }
          
          if (backup.data.areas) {
            Object.keys(backup.data.areas).forEach(newspaperId => {
              saveClickableAreas(newspaperId, backup.data.areas[newspaperId]);
            });
          }
          
          resolve(true);
        } else {
          reject(new Error('Invalid backup file format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};