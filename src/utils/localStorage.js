// Optimized localStorage utility functions
const STORAGE_KEYS = {
  NEWSPAPERS: 'newspapers_v2',
  TODAY: 'todaysNewspaper_v2',
  ADMIN: 'adminCredentials_v2'
};

// Compress data before storing
const compressData = (data) => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('Compression error:', error);
    return null;
  }
};

// Decompress data after retrieving
const decompressData = (data) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Decompression error:', error);
    return null;
  }
};

export const saveToLocalStorage = (key, data) => {
  try {
    if (typeof Storage === 'undefined' || !window.localStorage) {
      console.warn('localStorage not available');
      return false;
    }
    
    const compressed = compressData(data);
    if (!compressed) return false;
    

    
    localStorage.setItem(key, compressed);
    
    // Verify save
    const saved = localStorage.getItem(key);
    if (!saved) {
      throw new Error('Data not saved properly');
    }
    
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      try {
        cleanupOldData();
        localStorage.setItem(key, compressed);
        return true;
      } catch (e) {
        console.error('Storage full:', e);
      }
    }
    return false;
  }
};

export const getFromLocalStorage = (key) => {
  try {
    if (typeof Storage === 'undefined' || !window.localStorage) {
      return null;
    }
    
    const item = localStorage.getItem(key);
    return item ? decompressData(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Could not remove corrupted item:', e);
    }
    return null;
  }
};

// Cleanup old data to free space
const cleanupOldData = () => {
  try {
    const newspapers = getNewspapers();
    if (newspapers.length > 10) {
      // Keep only latest 10 newspapers
      const sorted = newspapers.sort((a, b) => new Date(b.date) - new Date(a.date));
      const toKeep = sorted.slice(0, 10);
      saveToLocalStorage(STORAGE_KEYS.NEWSPAPERS, toKeep);
    }
  } catch (error) {
    console.error('Cleanup error:', error);
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

// Enhanced storage info with cleanup suggestions
export const getStorageInfo = () => {
  try {
    if (typeof Storage === 'undefined' || !window.localStorage) {
      return { used: 0, usedMB: '0.00', available: false };
    }
    
    let totalSize = 0;
    let appSize = 0;
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const itemSize = localStorage[key].length;
        totalSize += itemSize;
        
        // Track app-specific data
        if (key.includes('newspapers') || key.includes('areas_') || 
            key.includes('todaysNewspaper') || key.includes('adminCredentials')) {
          appSize += itemSize;
        }
      }
    }
    
    const estimatedLimit = 10 * 1024 * 1024; // 10MB
    const usedMB = (totalSize / (1024 * 1024)).toFixed(2);
    const appUsedMB = (appSize / (1024 * 1024)).toFixed(2);
    const availableMB = ((estimatedLimit - totalSize) / (1024 * 1024)).toFixed(2);
    const usagePercent = ((totalSize / estimatedLimit) * 100).toFixed(1);
    
    return {
      used: totalSize,
      usedMB,
      appUsedMB,
      availableMB,
      usagePercent,
      available: true,
      needsCleanup: totalSize > estimatedLimit * 0.8 // Suggest cleanup at 80%
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return { used: 0, usedMB: '0.00', available: false };
  }
};

// Get newspaper count and suggest cleanup
export const getDataStats = () => {
  try {
    const newspapers = getNewspapers();
    const totalAreas = newspapers.reduce((sum, n) => sum + (n.areas?.length || 0), 0);
    
    return {
      newspaperCount: newspapers.length,
      totalAreas,
      oldestDate: newspapers.length > 0 ? 
        new Date(Math.min(...newspapers.map(n => new Date(n.date)))).toLocaleDateString('kn-IN') : null,
      newestDate: newspapers.length > 0 ? 
        new Date(Math.max(...newspapers.map(n => new Date(n.date)))).toLocaleDateString('kn-IN') : null
    };
  } catch (error) {
    console.error('Error getting data stats:', error);
    return { newspaperCount: 0, totalAreas: 0 };
  }
};

// Clear all app data
export const clearAllData = () => {
  try {
    // Clear new format keys
    Object.values(STORAGE_KEYS).forEach(key => {
      removeFromLocalStorage(key);
    });
    
    // Clear old format keys
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

// Optimized newspaper data functions
export const saveNewspaper = (newspaper) => {
  try {
    const newspapers = getNewspapers();
    const existingIndex = newspapers.findIndex(n => n.id === newspaper.id);
    
    // Optimize newspaper data before saving
    const optimizedNewspaper = {
      ...newspaper,
      // Store only essential data
      pages: newspaper.pages ? newspaper.pages.map(page => ({
        pageNumber: page.pageNumber,
        imageUrl: page.imageUrl,
        width: page.width,
        height: page.height
      })) : undefined,
      areas: newspaper.areas || [] // Store areas with newspaper
    };
    
    if (existingIndex >= 0) {
      newspapers[existingIndex] = optimizedNewspaper;
    } else {
      newspapers.push(optimizedNewspaper);
    }
    
    return saveToLocalStorage(STORAGE_KEYS.NEWSPAPERS, newspapers);
  } catch (error) {
    console.error('Error saving newspaper:', error);
    return false;
  }
};

export const deleteNewspaper = (newspaperId) => {
  try {
    const newspapers = getNewspapers();
    const filteredNewspapers = newspapers.filter(n => n.id !== newspaperId);
    
    // Remove legacy area storage
    removeFromLocalStorage(`areas_${newspaperId}`);
    
    // Clear today's newspaper if it's the deleted one
    const todaysNewspaper = getTodaysNewspaper();
    if (todaysNewspaper && todaysNewspaper.id === newspaperId) {
      removeFromLocalStorage(STORAGE_KEYS.TODAY);
    }
    
    return saveToLocalStorage(STORAGE_KEYS.NEWSPAPERS, filteredNewspapers);
  } catch (error) {
    console.error('Error deleting newspaper:', error);
    return false;
  }
};

export const publishToday = (newspaperId) => {
  try {
    const newspapers = getNewspapers();
    const newspaper = newspapers.find(n => n.id === newspaperId);
    if (newspaper) {
      return setTodaysNewspaper(newspaper);
    }
    return false;
  } catch (error) {
    console.error('Error publishing newspaper:', error);
    return false;
  }
};

export const getNewspapers = () => {
  // Try new format first, fallback to old format
  let newspapers = getFromLocalStorage(STORAGE_KEYS.NEWSPAPERS);
  if (!newspapers) {
    newspapers = getFromLocalStorage('newspapers') || [];
    // Migrate old data if exists
    if (newspapers.length > 0) {
      migrateOldData(newspapers);
    }
  }
  return newspapers || [];
};

// Migrate old data format to new optimized format
const migrateOldData = (oldNewspapers) => {
  try {
    const migratedNewspapers = oldNewspapers.map(newspaper => {
      const areas = getFromLocalStorage(`areas_${newspaper.id}`) || [];
      return {
        ...newspaper,
        areas // Include areas in newspaper object
      };
    });
    
    saveToLocalStorage(STORAGE_KEYS.NEWSPAPERS, migratedNewspapers);
    
    // Clean up old area storage
    oldNewspapers.forEach(newspaper => {
      removeFromLocalStorage(`areas_${newspaper.id}`);
    });
    
    // Clean up old newspaper storage
    removeFromLocalStorage('newspapers');
    
    console.log('Data migration completed');
  } catch (error) {
    console.error('Migration error:', error);
  }
};

export const getNewspaperById = (id) => {
  const newspapers = getNewspapers();
  return newspapers.find(n => n.id === id) || null;
};

export const getTodaysNewspaper = () => {
  return getFromLocalStorage(STORAGE_KEYS.TODAY) || getFromLocalStorage('todaysNewspaper') || null;
};

export const setTodaysNewspaper = (newspaper) => {
  return saveToLocalStorage(STORAGE_KEYS.TODAY, newspaper);
};

// Optimized area management - now stored with newspaper
export const saveClickableAreas = (newspaperId, areas) => {
  try {
    const newspapers = getNewspapers();
    const newspaperIndex = newspapers.findIndex(n => n.id === newspaperId);
    
    if (newspaperIndex >= 0) {
      newspapers[newspaperIndex].areas = areas;
      return saveToLocalStorage(STORAGE_KEYS.NEWSPAPERS, newspapers);
    }
    return false;
  } catch (error) {
    console.error('Error saving areas:', error);
    return false;
  }
};

export const getClickableAreas = (newspaperId) => {
  try {
    const newspapers = getNewspapers();
    const newspaper = newspapers.find(n => n.id === newspaperId);
    return newspaper?.areas || getFromLocalStorage(`areas_${newspaperId}`) || [];
  } catch (error) {
    console.error('Error getting areas:', error);
    return [];
  }
};

export const saveAreaContent = (newspaperId, areaId, content) => {
  try {
    const areas = getClickableAreas(newspaperId);
    const areaIndex = areas.findIndex(a => a.id === areaId);
    
    if (areaIndex >= 0) {
      areas[areaIndex] = { ...areas[areaIndex], ...content };
      return saveClickableAreas(newspaperId, areas);
    }
    return false;
  } catch (error) {
    console.error('Error saving area content:', error);
    return false;
  }
};

// Admin credentials
export const saveAdminCredentials = (credentials) => {
  return saveToLocalStorage(STORAGE_KEYS.ADMIN, credentials);
};

export const getAdminCredentials = () => {
  return getFromLocalStorage(STORAGE_KEYS.ADMIN) || getFromLocalStorage('adminCredentials');
};

// Optimized backup and restore functions
export const createBackup = () => {
  try {
    const backup = {
      version: '2.0',
      timestamp: new Date().toISOString(),
      data: {
        newspapers: getNewspapers(), // Areas are now included in newspapers
        todaysNewspaper: getTodaysNewspaper()
      }
    };
    
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
          // Handle both old and new backup formats
          if (backup.data.newspapers) {
            if (backup.version === '2.0') {
              // New format - areas included in newspapers
              saveToLocalStorage(STORAGE_KEYS.NEWSPAPERS, backup.data.newspapers);
            } else {
              // Old format - migrate areas
              const newspapers = backup.data.newspapers.map(newspaper => {
                const areas = backup.data.areas?.[newspaper.id] || [];
                return { ...newspaper, areas };
              });
              saveToLocalStorage(STORAGE_KEYS.NEWSPAPERS, newspapers);
            }
          }
          
          if (backup.data.todaysNewspaper) {
            saveToLocalStorage(STORAGE_KEYS.TODAY, backup.data.todaysNewspaper);
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