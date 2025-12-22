# Firebase Integration Setup

## Quick Setup Steps

### 1. Get Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/project/raichur-belaku/settings/general)
2. Scroll down to "Your apps" section
3. If no web app exists, click "Add app" → Web (</>) icon
4. Copy the configuration values

### 2. Update Environment File
Edit `.env` file and replace with your actual values:

```
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=raichur-belaku.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=raichur-belaku
VITE_FIREBASE_STORAGE_BUCKET=raichur-belaku.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
VITE_FIREBASE_APP_ID=your_actual_app_id
```

### 3. Enable Required Services

#### Enable Firestore
1. Go to [Firestore Database](https://console.firebase.google.com/project/raichur-belaku/firestore)
2. Click "Create database"
3. Choose "Start in test mode"
4. Select location (asia-south1 recommended for India)

#### Enable Storage
1. Go to [Storage](https://console.firebase.google.com/project/raichur-belaku/storage)
2. Click "Get started"
3. Choose "Start in test mode"
4. Use same location as Firestore

### 4. Configure Security Rules

#### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

#### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### 5. Test Integration
1. Run `npm run dev`
2. Go to Admin Dashboard
3. Check "Storage Status" - should show "Firebase Cloud Storage"
4. Try uploading a newspaper

## What Changed

✅ **Data Storage**: Now uses Firestore instead of memory
✅ **File Storage**: PDFs stored in Firebase Storage
✅ **Cross-device Access**: Data syncs across all devices
✅ **Persistence**: Data survives browser restarts
✅ **Scalability**: Can handle multiple users and large files

## Collections Created

- `newspapers` - All newspaper documents
- `settings` - App settings (today's newspaper, etc.)

## File Structure

- `pdfs/` - Original PDF files in Firebase Storage
- `images/` - Newspaper page images in Firebase Storage