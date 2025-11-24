// Test localStorage functionality
export const testLocalStorage = () => {
  console.log('Testing localStorage...');
  
  // Check if localStorage is available
  if (typeof Storage === 'undefined' || !window.localStorage) {
    console.error('localStorage not available');
    return false;
  }
  
  try {
    // Test basic functionality
    const testKey = 'test_key';
    const testData = { message: 'test data', timestamp: Date.now() };
    
    // Save test data
    localStorage.setItem(testKey, JSON.stringify(testData));
    console.log('✓ Test data saved');
    
    // Retrieve test data
    const retrieved = localStorage.getItem(testKey);
    const parsed = JSON.parse(retrieved);
    console.log('✓ Test data retrieved:', parsed);
    
    // Clean up
    localStorage.removeItem(testKey);
    console.log('✓ Test data cleaned up');
    
    // Check current localStorage contents
    console.log('Current localStorage keys:', Object.keys(localStorage));
    
    // Check app-specific data
    const appKeys = Object.keys(localStorage).filter(key => 
      key.includes('newspapers') || key.includes('areas_') || 
      key.includes('todaysNewspaper') || key.includes('adminCredentials')
    );
    console.log('App-specific keys:', appKeys);
    
    // Show sizes
    let totalSize = 0;
    appKeys.forEach(key => {
      const size = localStorage[key].length;
      totalSize += size;
      console.log(`${key}: ${(size / 1024).toFixed(2)} KB`);
    });
    console.log(`Total app data: ${(totalSize / 1024).toFixed(2)} KB`);
    
    return true;
  } catch (error) {
    console.error('localStorage test failed:', error);
    return false;
  }
};

// Force save test data
export const forceSaveTest = () => {
  try {
    const testNewspaper = {
      id: 'test_' + Date.now(),
      name: 'Test Newspaper',
      date: new Date().toISOString(),
      areas: []
    };
    
    localStorage.setItem('newspapers_v2', JSON.stringify([testNewspaper]));
    console.log('✓ Force saved test newspaper');
    
    const retrieved = localStorage.getItem('newspapers_v2');
    console.log('✓ Retrieved:', JSON.parse(retrieved));
    
    return true;
  } catch (error) {
    console.error('Force save failed:', error);
    return false;
  }
};