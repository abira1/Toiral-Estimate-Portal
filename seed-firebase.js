// Seed Firebase with initial team members
import { seedInitialData } from './src/lib/firebaseServices.ts';

console.log('🌱 Seeding Firebase with initial data...');
seedInitialData()
  .then(() => {
    console.log('✅ Seeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
