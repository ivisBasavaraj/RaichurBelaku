# Firebase Setup Guide for Raichuru Belku

This guide will help you set up Firebase to enable cloud storage and make your newspaper data accessible across all devices.

## Why Firebase?

- **Cross-device access**: Users can see newspapers on any device
- **Real-time updates**: Changes appear instantly for all users
- **Scalable storage**: Handle large PDF files and images
- **Reliable hosting**: 99.9% uptime guarantee

## Step-by-Step Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: `raichuru-belku-newspaper`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Required Services

#### Enable Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for now)
4. Select a location (choose closest to your users)
5. Click "Done"

#### Enable Storage
1. Go to "Storage" in Firebase Console
2. Click "Get started"
3. Choose "Start in test mode"
4. Select same location as Firestore
5. Click "Done"

#### Enable Authentication (Optional)
1. Go to "Authentication" in Firebase Console
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Anonymous" authentication
5. Click "Save"

### 3. Get Firebase Configuration

1. In Firebase Console, click the gear icon → "Project settings"
2. Scroll down to "Your apps" section
3. Click "Web" icon (</>) to add a web app
4. Enter app nickname: `raichuru-belku-web`
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"
7. Copy the configuration object

### 4. Update Application Configuration

1. Open `src/utils/firebase.js` in your project
2. Replace the placeholder configuration with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "your-actual-app-id"
};
```

### 5. Configure Security Rules

#### Firestore Rules
1. Go to "Firestore Database" → "Rules" tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all documents
    match /{document=**} {
      allow read: if true;
    }
    
    // Allow write access to newspapers and settings
    match /newspapers/{document} {
      allow write: if true;
    }
    
    match /settings/{document} {
      allow write: if true;
    }
  }
}
```

#### Storage Rules
1. Go to "Storage" → "Rules" tab
2. Replace the rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all files
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Allow write access to pdfs and images folders
    match /pdfs/{allPaths=**} {
      allow write: if true;
    }
    
    match /images/{allPaths=**} {
      allow write: if true;
    }
  }
}
```

### 6. Install Dependencies

Run the following command in your project directory:

```bash
npm install
```

The Firebase dependency is already added to package.json.

### 7. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to Admin Dashboard
3. Check the "Storage Status" section
4. It should show "Firebase Cloud Storage" if configured correctly
5. Try uploading a newspaper to test the functionality

## Production Security

⚠️ **Important**: The rules above are for development/testing only. For production, implement proper security:

### Secure Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access
    match /{document=**} {
      allow read: if true;
    }
    
    // Admin-only write access (implement authentication)
    match /newspapers/{document} {
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
    
    match /settings/{document} {
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
  }
}
```

### Secure Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public read access
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Admin-only write access
    match /pdfs/{allPaths=**} {
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
    
    match /images/{allPaths=**} {
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **"Firebase not configured" error**
   - Check that your config in `firebase.js` has real values (not placeholders)
   - Ensure all required fields are filled

2. **Permission denied errors**
   - Check Firestore and Storage rules
   - Ensure rules allow the operations you're trying to perform

3. **Files not uploading**
   - Check Storage rules
   - Verify your Storage bucket exists
   - Check browser console for detailed errors

4. **Data not syncing**
   - Check Firestore rules
   - Verify your project ID is correct
   - Check network connectivity

### Getting Help

1. Check the browser console for error messages
2. Review Firebase Console logs
3. Verify your configuration matches the setup guide
4. Test with simple operations first (like reading data)

## Benefits After Setup

Once Firebase is configured:

- ✅ Newspapers uploaded by admin are visible to all users
- ✅ Data persists across browser sessions and devices
- ✅ Real-time updates when new content is published
- ✅ Reliable cloud storage for PDF files and images
- ✅ Scalable infrastructure that grows with your audience
- ✅ Automatic backups and data redundancy

## Cost Considerations

Firebase offers generous free tiers:

- **Firestore**: 50,000 reads, 20,000 writes per day
- **Storage**: 5GB storage, 1GB/day downloads
- **Hosting**: 10GB storage, 360MB/day transfers

For a local newspaper, these limits should be sufficient. Monitor usage in Firebase Console.