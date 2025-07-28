# Firebase Setup Guide

## Prerequisites
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database in your Firebase project
3. Enable Storage in your Firebase project

## Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## How to Get Firebase Config
1. Go to your Firebase Console
2. Click on the gear icon (⚙️) next to "Project Overview"
3. Select "Project settings"
4. Scroll down to "Your apps" section
5. Click on the web app icon (</>)
6. Copy the configuration values

## Enable Firebase Services

### Firestore Database
1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location close to your users

### Storage
1. Go to "Storage" in the left sidebar
2. Click "Get started"
3. Choose "Start in test mode" for development
4. Select a location close to your users

## Firestore Rules
Make sure your Firestore security rules allow read/write operations:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reports/{document} {
      allow read, write: if true; // For development - make more restrictive for production
    }
  }
}
```

## Storage Rules
Make sure your Storage security rules allow read/write operations:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /reports/{allPaths=**} {
      allow read, write: if true; // For development - make more restrictive for production
    }
  }
}
```

## Features Added
- ✅ Data persistence to Firebase Firestore
- ✅ Image storage in Firebase Storage
- ✅ Real-time data loading
- ✅ Automatic data synchronization
- ✅ Loading states and error handling
- ✅ Success/error messages in Arabic
- ✅ Automatic image cleanup when records are deleted 