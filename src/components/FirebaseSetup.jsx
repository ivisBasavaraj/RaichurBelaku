import React, { useState } from 'react';
import { getStorageStatus } from '../utils/hybridStorage';

const FirebaseSetup = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const storageStatus = getStorageStatus();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">ಸ್ಟೋರೇಜ್ ಸ್ಥಿತಿ</h3>
          <p className="text-sm text-gray-600">
            ಪ್ರಸ್ತುತ ಬಳಸುತ್ತಿರುವುದು: <span className="font-medium">{storageStatus.storageType}</span>
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          storageStatus.usingFirebase 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {storageStatus.usingFirebase ? 'ಕ್ಲೌಡ್ ಸ್ಟೋರೇಜ್' : 'ಲೋಕಲ್ ಸ್ಟೋರೇಜ್'}
        </div>
      </div>

      {!storageStatus.usingFirebase && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-yellow-800">ಲೋಕಲ್ ಸ್ಟೋರೇಜ್ ಮೋಡ್</h4>
              <p className="text-sm text-yellow-700 mt-1">
                ಪ್ರಸ್ತುತ ಡೇಟಾ ಕೇವಲ ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮಾತ್ರ ಉಳಿಸಲಾಗುತ್ತಿದೆ. ಎಲ್ಲಾ ಸಾಧನಗಳಲ್ಲಿ ಪ್ರವೇಶಿಸಲು Firebase ಸೆಟಪ್ ಮಾಡಿ.
              </p>
            </div>
          </div>
        </div>
      )}

      {storageStatus.usingFirebase && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-green-800">Firebase ಸಕ್ರಿಯವಾಗಿದೆ</h4>
              <p className="text-sm text-green-700 mt-1">
                ಡೇಟಾ ಕ್ಲೌಡ್‌ನಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿ ಉಳಿಸಲಾಗುತ್ತಿದೆ ಮತ್ತು ಎಲ್ಲಾ ಸಾಧನಗಳಲ್ಲಿ ಲಭ್ಯವಿದೆ.
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowInstructions(!showInstructions)}
        className="text-newspaper-blue hover:text-blue-700 text-sm font-medium"
      >
        {showInstructions ? 'ಸೂಚನೆಗಳನ್ನು ಮರೆಮಾಡಿ' : 'Firebase ಸೆಟಪ್ ಸೂಚನೆಗಳು'}
      </button>

      {showInstructions && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Firebase ಸೆಟಪ್ ಮಾಡುವ ವಿಧಾನ:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>
              <a 
                href="https://console.firebase.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-newspaper-blue hover:underline"
              >
                Firebase Console
              </a> ಗೆ ಹೋಗಿ ಮತ್ತು ಹೊಸ ಪ್ರಾಜೆಕ್ಟ್ ರಚಿಸಿ
            </li>
            <li>Authentication, Firestore Database, ಮತ್ತು Storage ಸಕ್ರಿಯಗೊಳಿಸಿ</li>
            <li>Web ಆಪ್ ಸೇರಿಸಿ ಮತ್ತು configuration ಪಡೆದುಕೊಳ್ಳಿ</li>
            <li>
              <code className="bg-gray-200 px-2 py-1 rounded text-xs">src/utils/firebase.js</code> ಫೈಲ್‌ನಲ್ಲಿ 
              ನಿಮ್ಮ Firebase config ಅನ್ನು ಬದಲಾಯಿಸಿ
            </li>
            <li>Firestore ನಿಯಮಗಳನ್ನು ಸೆಟ್ ಮಾಡಿ (ಓದುವಿಕೆ/ಬರೆಯುವಿಕೆ ಅನುಮತಿಗಳು)</li>
            <li>Storage ನಿಯಮಗಳನ್ನು ಸೆಟ್ ಮಾಡಿ (ಫೈಲ್ ಅಪ್ಲೋಡ್ ಅನುಮತಿಗಳು)</li>
          </ol>
          
          <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
            <h5 className="font-medium text-blue-900 mb-2">ಮಾದರಿ Firestore ನಿಯಮಗಳು:</h5>
            <pre className="text-xs text-blue-800 overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
            </pre>
          </div>

          <div className="mt-4 p-3 bg-orange-50 rounded border border-orange-200">
            <h5 className="font-medium text-orange-900 mb-2">ಮಾದರಿ Storage ನಿಯಮಗಳು:</h5>
            <pre className="text-xs text-orange-800 overflow-x-auto">
{`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}`}
            </pre>
          </div>

          <div className="mt-4 text-xs text-gray-600">
            <strong>ಗಮನಿಸಿ:</strong> ಮೇಲಿನ ನಿಯಮಗಳು ಪರೀಕ್ಷೆಗಾಗಿ ಮಾತ್ರ. ಉತ್ಪಾದನೆಯಲ್ಲಿ ಸೂಕ್ತ ಭದ್ರತಾ ನಿಯಮಗಳನ್ನು ಬಳಸಿ.
          </div>
        </div>
      )}
    </div>
  );
};

export default FirebaseSetup;