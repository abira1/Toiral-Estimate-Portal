// Test Firebase read access
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get } = require('firebase/database');

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function testRead() {
  console.log('🔍 Testing Firebase read access...\n');
  
  try {
    // Try reading clients
    const clientsSnapshot = await get(ref(database, 'clients'));
    if (clientsSnapshot.exists()) {
      const clients = clientsSnapshot.val();
      console.log('✅ Clients data exists:');
      console.log(JSON.stringify(clients, null, 2));
    } else {
      console.log('⚠️  No clients data found');
    }
    
    // Try reading access codes
    const codesSnapshot = await get(ref(database, 'accessCodes'));
    if (codesSnapshot.exists()) {
      const codes = codesSnapshot.val();
      console.log('\n✅ Access codes data exists:');
      console.log(JSON.stringify(codes, null, 2));
    } else {
      console.log('\n⚠️  No access codes found');
    }
    
    // Try reading projects
    const projectsSnapshot = await get(ref(database, 'projects'));
    if (projectsSnapshot.exists()) {
      const projects = projectsSnapshot.val();
      console.log('\n✅ Projects data exists:');
      console.log(JSON.stringify(projects, null, 2));
    } else {
      console.log('\n⚠️  No projects found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error reading from Firebase:', error.message);
    console.error('\n⚠️  This likely means:');
    console.error('   1. Firebase Database rules need to be configured');
    console.error('   2. Current rules may require authentication');
    console.error('   3. Database may be empty');
    process.exit(1);
  }
}

testRead();
