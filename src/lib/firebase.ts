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

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA_DuOJRIf9AXnADwRNqtGf-v9RA9NKikI',
  authDomain: 'toiral-estimate-portal.firebaseapp.com',
  databaseURL: 'https://toiral-estimate-portal-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'toiral-estimate-portal',
  storageBucket: 'toiral-estimate-portal.firebasestorage.app',
  messagingSenderId: '992011570132',
  appId: '1:992011570132:web:1eef2c5ba17813dbb7a441',
  measurementId: 'G-6LZNV0GX65'
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