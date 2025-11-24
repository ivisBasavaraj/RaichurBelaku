// Emergency localStorage fix utilities

// Force clear and reinitialize localStorage
export const emergencyReset = () => {
  try {
    console.log('Performing emergency localStorage reset...');
    
    // Clear all app-related keys
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.includes('newspapers') || 
        key.includes('areas_') || 
        key.includes('todaysNewspaper') || 
        key.includes('adminCredentials')
      )) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log('Removed key:', key);
    });
    
    // Test basic functionality
    localStorage.setItem('test_reset', 'working');
    const test = localStorage.getItem('test_reset');
    localStorage.removeItem('test_reset');
    
    if (test === 'working') {
      console.log('✓ Emergency reset successful');
      return true;
    } else {
      console.error('✗ Emergency reset failed - localStorage not working');
      return false;
    }
  } catch (error) {
    console.error('Emergency reset error:', error);
    return false;
  }
};

// Force save with retry mechanism
export const forceSaveWithRetry = (key, data, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt} to save ${key}`);
      
      const jsonData = JSON.stringify(data);
      localStorage.setItem(key, jsonData);
      
      // Verify save
      const retrieved = localStorage.getItem(key);
      if (retrieved && retrieved === jsonData) {
        console.log(`✓ Successfully saved ${key} on attempt ${attempt}`);
        return true;
      } else {
        console.warn(`✗ Save verification failed for ${key} on attempt ${attempt}`);
      }
    } catch (error) {
      console.error(`Attempt ${attempt} failed for ${key}:`, error);
      
      if (error.name === 'QuotaExceededError' && attempt === 1) {
        // Try to free up space
        console.log('Storage quota exceeded, attempting cleanup...');
        try {
          // Remove oldest entries
          const newspapers = JSON.parse(localStorage.getItem('newspapers_v2') || '[]');
          if (newspapers.length > 5) {
            const sorted = newspapers.sort((a, b) => new Date(a.date) - new Date(b.date));
            const toKeep = sorted.slice(-5); // Keep only 5 newest
            localStorage.setItem('newspapers_v2', JSON.stringify(toKeep));
            console.log(`Cleaned up, kept ${toKeep.length} newspapers`);
          }
        } catch (cleanupError) {
          console.error('Cleanup failed:', cleanupError);
        }
      }
      
      if (attempt === maxRetries) {
        return false;
      }
      
      // Wait before retry
      setTimeout(() => {}, 100 * attempt);
    }
  }
  
  return false;
};

// Diagnostic function
export const diagnoseLocalStorage = () => {
  const diagnosis = {
    available: false,
    working: false,
    quota: 'unknown',
    currentKeys: [],
    appKeys: [],
    errors: []
  };
  
  try {
    // Check availability
    if (typeof Storage !== 'undefined' && window.localStorage) {
      diagnosis.available = true;
      
      // Test basic functionality
      localStorage.setItem('diagnostic_test', 'test_value');
      const retrieved = localStorage.getItem('diagnostic_test');
      localStorage.removeItem('diagnostic_test');
      
      if (retrieved === 'test_value') {
        diagnosis.working = true;
      } else {
        diagnosis.errors.push('Basic read/write test failed');
      }
      
      // Get current keys
      diagnosis.currentKeys = Object.keys(localStorage);
      diagnosis.appKeys = diagnosis.currentKeys.filter(key => 
        key.includes('newspapers') || key.includes('areas_') || 
        key.includes('todaysNewspaper') || key.includes('adminCredentials')
      );
      
      // Estimate quota usage
      let totalSize = 0;
      diagnosis.currentKeys.forEach(key => {
        try {
          totalSize += localStorage[key].length;
        } catch (e) {
          diagnosis.errors.push(`Error reading key ${key}: ${e.message}`);
        }
      });
      
      diagnosis.quota = `${(totalSize / 1024 / 1024).toFixed(2)} MB used`;
      
    } else {
      diagnosis.errors.push('localStorage not available in this browser');
    }
  } catch (error) {
    diagnosis.errors.push(`Diagnosis error: ${error.message}`);
  }
  
  console.log('localStorage Diagnosis:', diagnosis);
  return diagnosis;
};