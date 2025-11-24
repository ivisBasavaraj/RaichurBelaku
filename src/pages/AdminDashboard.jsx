import React, { useState, useEffect } from 'react';
import AdminUploadPDF from '../components/AdminUploadPDF';
import PDFMapper from '../components/PDFMapper';
import AdminLogin from '../components/AdminLogin';
import LocalStorageStatus from '../components/LocalStorageStatus';
import { getNewspapers, publishToday, getTodaysNewspaper, deleteNewspaper, getStorageInfo, clearAllData, createBackup, restoreFromBackup, getDataStats } from '../utils/localStorage';
import { testLocalStorage, forceSaveTest } from '../utils/localStorageTest';
import { emergencyReset, forceSaveWithRetry, diagnoseLocalStorage } from '../utils/localStorageFix';

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentNewspaper, setCurrentNewspaper] = useState(null);
  const [newspapers, setNewspapers] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');
  const [todaysNewspaper, setTodaysNewspaper] = useState(null);

  useEffect(() => {
    const loadNewspapers = () => {
      const savedNewspapers = getNewspapers();
      setNewspapers(savedNewspapers);
      setTodaysNewspaper(getTodaysNewspaper());
      
      if (savedNewspapers.length > 0) {
        setCurrentNewspaper(savedNewspapers[savedNewspapers.length - 1]);
      }
    };
    
    loadNewspapers();
  }, []);

  const handleUploadSuccess = (newspaper) => {
    console.log('Upload success callback called with:', newspaper);
    setCurrentNewspaper(newspaper);
    
    // Force refresh newspapers from localStorage
    const updatedNewspapers = getNewspapers();
    console.log('Refreshed newspapers from localStorage:', updatedNewspapers.length);
    setNewspapers(updatedNewspapers);
    
    setActiveTab('mapper');
  };

  const handleNewspaperSelect = (newspaper) => {
    setCurrentNewspaper(newspaper);
    setActiveTab('mapper');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handlePublishToday = (newspaperId) => {
    console.log('Publishing newspaper:', newspaperId);
    console.log('Available newspapers:', newspapers);
    const success = publishToday(newspaperId);
    console.log('Publish success:', success);
    if (success) {
      setTodaysNewspaper(newspapers.find(n => n.id === newspaperId));
      alert('ಇಂದಿನ ಪತ್ರಿಕೆಯಾಗಿ ಪ್ರಕಟಿಸಲಾಗಿದೆ!');
    } else {
      alert('ಪ್ರಕಟಿಸಲು ದೋಷ ಸಂಭವಿಸಿದೆ!');
    }
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LocalStorageStatus />
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-newspaper-blue mb-1 sm:mb-2">ಆಡಳಿತ ಡ್ಯಾಶ್ಬೋರ್ಡ್</h1>
            <p className="text-sm sm:text-base text-gray-600">ಪತ್ರಿಕೆ ಅಪ್ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ಕ್ಲಿಕ್ ಮಾಡಬಹುದಾದ ಪ್ರದೇಶಗಳನ್ನು ಸೇರಿಸಿ</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-newspaper-red text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base self-start sm:self-auto"
          >
            ಲಾಗ್ ಔಟ್
          </button>
        </div>

        <div className="mb-4 sm:mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex flex-wrap gap-2 sm:gap-0 sm:space-x-8">
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'upload'
                    ? 'border-newspaper-blue text-newspaper-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                PDF ಅಪ್ಲೋಡ್
              </button>
              <button
                onClick={() => setActiveTab('mapper')}
                className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'mapper'
                    ? 'border-newspaper-blue text-newspaper-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                disabled={!currentNewspaper}
              >
                ಪ್ರದೇಶ ಮ್ಯಾಪಿಂಗ್
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'manage'
                    ? 'border-newspaper-blue text-newspaper-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ಪತ್ರಿಕೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'data'
                    ? 'border-newspaper-blue text-newspaper-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ಡೇಟಾ ನಿರ್ವಹಣೆ
              </button>
            </nav>
          </div>
        </div>

        <div className="space-y-6">
          {activeTab === 'upload' && (
            <AdminUploadPDF onUploadSuccess={handleUploadSuccess} />
          )}

          {activeTab === 'mapper' && (
            <div>
              {currentNewspaper ? (
                <PDFMapper newspaper={currentNewspaper} />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">ಯಾವುದೇ ಪತ್ರಿಕೆ ಆಯ್ಕೆಯಾಗಿಲ್ಲ</h3>
                  <p className="text-gray-600">ಮೊದಲು PDF ಅಪ್ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಪತ್ರಿಕೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'manage' && (
            <ManageNewspapers 
              newspapers={newspapers}
              currentNewspaper={currentNewspaper}
              todaysNewspaper={todaysNewspaper}
              onNewspaperSelect={handleNewspaperSelect}
              onPublishToday={handlePublishToday}
              onEditNewspaper={(newspaper) => {
                handleNewspaperSelect(newspaper);
                setActiveTab('mapper');
              }}
              onDeleteNewspaper={(newspaperId) => {
                if (window.confirm('ಈ ಪತ್ರಿಕೆಯನ್ನು ಅಳಿಸಲು ನಿಶ್ಚಿತವಾಗಿದ್ದೀರಾ?')) {
                  deleteNewspaper(newspaperId);
                  setNewspapers(getNewspapers());
                  if (currentNewspaper?.id === newspaperId) {
                    setCurrentNewspaper(null);
                  }
                  if (todaysNewspaper?.id === newspaperId) {
                    setTodaysNewspaper(null);
                  }
                }
              }}
            />
          )}

          {activeTab === 'data' && (
            <DataManagement />
          )}
        </div>
      </div>
    </div>
  );
};

// Manage Newspapers Component
const ManageNewspapers = ({ newspapers, currentNewspaper, todaysNewspaper, onNewspaperSelect, onPublishToday, onEditNewspaper, onDeleteNewspaper }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-newspaper-blue mb-4">ಪತ್ರಿಕೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ</h2>
      
      {newspapers.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <p className="text-gray-600">ಇನ್ನೂ ಯಾವುದೇ ಪತ್ರಿಕೆಗಳನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಲಾಗಿಲ್ಲ</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {newspapers.map((newspaper) => (
            <div
              key={newspaper.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                currentNewspaper?.id === newspaper.id
                  ? 'border-newspaper-blue bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onNewspaperSelect(newspaper)}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={newspaper.previewImage}
                  alt={newspaper.name}
                  className="w-16 h-20 object-cover rounded border"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{newspaper.name}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(newspaper.date).toLocaleDateString('kn-IN')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ಗಾತ್ರ: {newspaper.width} × {newspaper.height}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {todaysNewspaper?.id === newspaper.id && (
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                      ಇಂದಿನ ಪತ್ರಿಕೆ
                    </span>
                  )}
                  {currentNewspaper?.id === newspaper.id && (
                    <span className="bg-newspaper-blue text-white text-xs px-2 py-1 rounded">
                      ಆಯ್ಕೆಯಾಗಿದೆ
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPublishToday(newspaper.id);
                    }}
                    className="bg-green-600 text-white text-xs px-2 py-1 rounded hover:bg-green-700"
                  >
                    ಪ್ರಕಟಿಸಿ
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditNewspaper(newspaper);
                    }}
                    className="text-newspaper-blue hover:text-blue-700 text-sm"
                  >
                    ಸಂಪಾದಿಸಿ
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNewspaper(newspaper.id);
                    }}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    ಅಳಿಸಿ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Data Management Component
const DataManagement = () => {
  const [storageInfo, setStorageInfo] = useState({ used: 0, usedMB: '0.00' });
  const [dataStats, setDataStats] = useState({ newspaperCount: 0, totalAreas: 0 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);
  
  const refreshData = () => {
    setStorageInfo(getStorageInfo());
    setDataStats(getDataStats());
  };

  const handleBackup = async () => {
    setIsLoading(true);
    try {
      const success = createBackup();
      if (success) {
        alert('ಬ್ಯಾಕಪ್ ಯಶಸ್ವಿಯಾಗಿ ಡೌನ್ಲೋಡ್ ಆಗಿದೆ!');
      } else {
        alert('ಬ್ಯಾಕಪ್ ಮಾಡಲು ದೋಷ ಸಂಭವಿಸಿದೆ');
      }
    } catch (error) {
      alert('ಬ್ಯಾಕಪ್ ಮಾಡಲು ದೋಷ ಸಂಭವಿಸಿದೆ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    try {
      await restoreFromBackup(file);
      alert('ಡೇಟಾ ಯಶಸ್ವಿಯಾಗಿ ರಿಸ್ಟೋರ್ ಆಗಿದೆ! ಪೇಜ್ ರಿಲೋಡ್ ಮಾಡಿ.');
      window.location.reload();
    } catch (error) {
      alert('ರಿಸ್ಟೋರ್ ಮಾಡಲು ದೋಷ ಸಂಭವಿಸಿದೆ');
    } finally {
      setIsLoading(false);
    }
    event.target.value = '';
  };

  const handleClearAll = () => {
    if (window.confirm('ಎಲ್ಲಾ ಡೇಟಾವನ್ನು ಅಳಿಸಲು ನಿಶ್ಚಿತವಾಗಿದ್ದೀರಾ? ಇದನ್ನು ವಾಪಸ್ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ.')) {
      const success = clearAllData();
      if (success) {
        alert('ಎಲ್ಲಾ ಡೇಟಾ ಅಳಿಸಲಾಗಿದೆ! ಪೇಜ್ ರಿಲೋಡ್ ಆಗುತ್ತದೆ.');
        window.location.reload();
      } else {
        alert('ಡೇಟಾ ಅಳಿಸಲು ದೋಷ ಸಂಭವಿಸಿದೆ');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-newspaper-blue mb-6">ಡೇಟಾ ನಿರ್ವಹಣೆ</h2>
      
      {/* Storage Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-3">ಸ್ಟೋರೇಜ್ ಮಾಹಿತಿ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-sm text-gray-600">
              ಒಟ್ಟು ವಾಪರಾಶೆ: <span className="font-medium">{storageInfo.usedMB} MB</span>
            </p>
            <p className="text-sm text-gray-600">
              ಆಪ್ ಡೇಟಾ: <span className="font-medium">{storageInfo.appUsedMB} MB</span>
            </p>
            <p className="text-sm text-gray-600">
              ಲಭ್ಯವಿರುವ ಸ್ಥಳ: <span className="font-medium">{storageInfo.availableMB} MB</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              ಪತ್ರಿಕೆಗಳು: <span className="font-medium">{dataStats.newspaperCount}</span>
            </p>
            <p className="text-sm text-gray-600">
              ಒಟ್ಟು ಪ್ರದೇಶಗಳು: <span className="font-medium">{dataStats.totalAreas}</span>
            </p>
            {dataStats.oldestDate && (
              <p className="text-sm text-gray-600">
                ಹಳೆಯ ದಿನಾಂಕ: <span className="font-medium">{dataStats.oldestDate}</span>
              </p>
            )}
          </div>
        </div>
        
        {storageInfo.needsCleanup && (
          <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              ⚠️ ಸ್ಟೋರೇಜ್ {storageInfo.usagePercent}% ತುಂಬಿದೆ. ಹಳೆಯ ಪತ್ರಿಕೆಗಳನ್ನು ಅಳಿಸಿ.
            </p>
          </div>
        )}
        
        <button
          onClick={refreshData}
          className="text-sm text-newspaper-blue hover:text-blue-700"
        >
          ರಿಫ್ರೆಶ್ ಮಾಡಿ
        </button>
      </div>

      {/* Backup & Restore */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">ಬ್ಯಾಕಪ್</h3>
          <p className="text-sm text-gray-600 mb-4">ಎಲ್ಲಾ ಡೇಟಾವನ್ನು ಫೈಲ್‌ಗೆ ಎಕ್ಸ್‌ಪೋರ್ಟ್ ಮಾಡಿ</p>
          <button
            onClick={handleBackup}
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...' : 'ಬ್ಯಾಕಪ್ ಡೌನ್ಲೋಡ್ ಮಾಡಿ'}
          </button>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">ರಿಸ್ಟೋರ್</h3>
          <p className="text-sm text-gray-600 mb-4">ಬ್ಯಾಕಪ್ ಫೈಲ್‌ನಿಂದ ಡೇಟಾ ರಿಸ್ಟೋರ್ ಮಾಡಿ</p>
          <input
            type="file"
            accept=".json"
            onChange={handleRestore}
            disabled={isLoading}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-newspaper-blue file:text-white hover:file:bg-blue-700 disabled:opacity-50"
          />
        </div>
      </div>

      {/* Cleanup Options */}
      <div className="mb-6 p-4 border border-orange-200 rounded-lg bg-orange-50">
        <h3 className="text-lg font-medium text-orange-900 mb-2">ಸ್ಟೋರೇಜ್ ಕ್ಲೀನಪ್</h3>
        <p className="text-sm text-orange-700 mb-4">ಸ್ಟೋರೇಜ್ ಸ್ಥಳ ಉಳಿಸಲು ಹಳೆಯ ಪತ್ರಿಕೆಗಳನ್ನು ಅಳಿಸಿ</p>
        <button
          onClick={() => {
            if (window.confirm('10 ಕ್ಕಿಂತ ಹಳೆಯ ಪತ್ರಿಕೆಗಳನ್ನು ಅಳಿಸಲು ನಿಶ್ಚಿತವಾಗಿದ್ದೀರಾ?')) {
              const newspapers = getNewspapers();
              if (newspapers.length > 10) {
                const sorted = newspapers.sort((a, b) => new Date(b.date) - new Date(a.date));
                const toDelete = sorted.slice(10);
                toDelete.forEach(n => deleteNewspaper(n.id));
                alert(`${toDelete.length} ಹಳೆಯ ಪತ್ರಿಕೆಗಳನ್ನು ಅಳಿಸಲಾಗಿದೆ`);
                refreshData();
              } else {
                alert('ಅಳಿಸಲು ಹಳೆಯ ಪತ್ರಿಕೆಗಳಿಲ್ಲ');
              }
            }
          }}
          disabled={isLoading || dataStats.newspaperCount <= 10}
          className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors mr-3"
        >
          ಹಳೆಯ ಪತ್ರಿಕೆಗಳನ್ನು ಅಳಿಸಿ
        </button>
        <span className="text-sm text-gray-600">
          ({Math.max(0, dataStats.newspaperCount - 10)} ಅಳಿಸಬಹುದು)
        </span>
      </div>

      {/* Debug Zone */}
      <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
        <h3 className="text-lg font-medium text-blue-900 mb-2">ಡೀಬಗ್ ಟೂಲ್ಸ್</h3>
        <p className="text-sm text-blue-700 mb-4">localStorage ಸಮಸ್ಯೆಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              const result = testLocalStorage();
              alert(result ? 'localStorage ಕೆಲಸ ಮಾಡುತ್ತಿದೆ! ಕನ್ಸೋಲ್ ಪರೀಕ್ಷಿಸಿ.' : 'localStorage ಸಮಸ್ಯೆ!');
            }}
            className="bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            ಬೇಸಿಕ್ ಟೆಸ್ಟ್
          </button>
          <button
            onClick={() => {
              const result = forceSaveTest();
              alert(result ? 'ಟೆಸ್ಟ್ ಡೇಟಾ ಉಳಿಸಲಾಗಿದೆ!' : 'ಟೆಸ್ಟ್ ಫೇಲ್!');
              refreshData();
            }}
            className="bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            ಫೋರ್ಸ್ ಸೇವ್
          </button>
          <button
            onClick={() => {
              diagnoseLocalStorage();
              alert('ಡಾಯಗ್ನೋಸಿಸ್ ಪೂರ್ಣ! ಕನ್ಸೋಲ್ ಪರೀಕ್ಷಿಸಿ.');
            }}
            className="bg-orange-600 text-white py-2 px-3 rounded-lg hover:bg-orange-700 transition-colors text-sm"
          >
            ಡಾಯಗ್ನೋಸಿಸ್
          </button>
          <button
            onClick={() => {
              if (window.confirm('ಎಲ್ಲಾ ಡೇಟಾ ಅಳಿಸಿ localStorage ರೀಸೆಟ್ ಮಾಡಲು ನಿಶ್ಚಿತವಾಗಿದ್ದೀರಾ?')) {
                const result = emergencyReset();
                alert(result ? 'ರೀಸೆಟ್ ಯಶಸ್ವಿ!' : 'ರೀಸೆಟ್ ಫೇಲ್!');
                refreshData();
                window.location.reload();
              }
            }}
            className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            ಎಮರ್ಜೆನ್ಸಿ ರೀಸೆಟ್
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <h3 className="text-lg font-medium text-red-900 mb-2">ಅಪಾಯಕಾರಿ ಕ್ಷೇತ್ರ</h3>
        <p className="text-sm text-red-700 mb-4">ಇದು ಎಲ್ಲಾ ಡೇಟಾವನ್ನು ಶಾಶ್ವತವಾಗಿ ಅಳಿಸುತ್ತದೆ. ಇದನ್ನು ವಾಪಸ್ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ.</p>
        <button
          onClick={handleClearAll}
          disabled={isLoading}
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          ಎಲ್ಲಾ ಡೇಟಾ ಅಳಿಸಿ
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;