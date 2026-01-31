// ==========================================
// FIREBASE CONFIGURATION
// ==========================================
//
// SETUP INSTRUCTIONS:
// 1. Go to Firebase Console (https://console.firebase.google.com)
// 2. Create a new project or select existing one
// 3. Enable Realtime Database (Build > Realtime Database)
// 4. Set database rules (see below)
// 5. Enable Google Authentication (Build > Authentication > Sign-in method)
// 6. Copy your config from Project Settings > General > Your apps > Web app
// 7. Replace the firebaseConfig below with your actual config
//
// DATABASE RULES (for development - tighten for production):
// {
//   "rules": {
//     ".read": true,
//     ".write": true
//   }
// }
// ==========================================

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getAuth, Auth } from 'firebase/auth';

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  databaseURL: 'https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID'
};

// Initialize Firebase
let app: FirebaseApp;
let database: Database;
let auth: Auth;

try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  auth = getAuth(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { app, database, auth };

// Check if Firebase is properly configured
export const isFirebaseConfigured = (): boolean => {
  return firebaseConfig.apiKey !== 'YOUR_API_KEY';
};