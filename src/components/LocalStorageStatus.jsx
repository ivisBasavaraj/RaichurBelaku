import React, { useState, useEffect } from 'react';
import { getStorageInfo, getNewspapers } from '../utils/localStorage';

const LocalStorageStatus = () => {
  const [status, setStatus] = useState({
    available: false,
    newspapers: 0,
    storageUsed: '0.00'
  });

  const refreshStatus = () => {
    try {
      const storageInfo = getStorageInfo();
      const newspapers = getNewspapers();
      
      setStatus({
        available: storageInfo.available,
        newspapers: newspapers.length,
        storageUsed: storageInfo.usedMB
      });
      
      console.log('LocalStorage Status:', {
        available: storageInfo.available,
        newspapers: newspapers.length,
        storageUsed: storageInfo.usedMB,
        newspaperData: newspapers
      });
    } catch (error) {
      console.error('Error checking localStorage status:', error);
      setStatus({
        available: false,
        newspapers: 0,
        storageUsed: '0.00'
      });
    }
  };

  useEffect(() => {
    refreshStatus();
    
    // Refresh every 5 seconds
    const interval = setInterval(refreshStatus, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-3 shadow-lg text-xs z-50">
      <div className="font-semibold text-gray-700 mb-1">Storage Status</div>
      <div className={`text-${status.available ? 'green' : 'red'}-600`}>
        {status.available ? '✓' : '✗'} localStorage: {status.available ? 'Available' : 'Not Available'}
      </div>
      <div className="text-gray-600">
        Newspapers: {status.newspapers}
      </div>
      <div className="text-gray-600">
        Used: {status.storageUsed} MB
      </div>
      <button 
        onClick={refreshStatus}
        className="mt-1 text-blue-600 hover:text-blue-800 underline"
      >
        Refresh
      </button>
    </div>
  );
};

export default LocalStorageStatus;