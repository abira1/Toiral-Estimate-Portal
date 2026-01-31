// Seed Firebase with test data (CommonJS version)
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set } = require('firebase/database');

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
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Generate test access code
const testAccessCode = 'PRJ-2025-TEST';

async function seedTestData() {
  console.log('🌱 Seeding test data to Firebase...\n');
  
  try {
    // 1. Create test team members
    console.log('Creating team members...');
    const teamMembers = [
      {
        id: 'team-001',
        name: 'Alex Morgan',
        role: 'Project Manager',
        email: 'alex@toiral.com',
        projectCount: 3
      },
      {
        id: 'team-002',
        name: 'Sam Wilson',
        role: 'Lead Developer',
        email: 'sam@toiral.com',
        projectCount: 5
      },
      {
        id: 'team-003',
        name: 'Jordan Lee',
        role: 'UI Designer',
        email: 'jordan@toiral.com',
        projectCount: 2
      },
      {
        id: 'team-004',
        name: 'Casey Brown',
        role: 'Backend Dev',
        email: 'casey@toiral.com',
        projectCount: 4
      }
    ];
    
    for (const member of teamMembers) {
      await set(ref(database, `teamMembers/${member.id}`), member);
      console.log(`  ✅ Added: ${member.name} - ${member.role}`);
    }
    
    // 2. Create test client
    console.log('\nCreating test client...');
    const testClient = {
      id: 'client-test-001',
      accessCode: testAccessCode,
      name: 'John Smith',
      companyName: 'Tech Innovations Inc',
      email: 'john.smith@techinnovations.com',
      phone: '+1-555-0123',
      status: 'Active',
      projectIds: ['project-test-001'],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    await set(ref(database, `clients/${testClient.id}`), testClient);
    console.log(`  ✅ Added client: ${testClient.name} (${testClient.companyName})`);
    
    // 3. Create access code mapping
    console.log('\nCreating access code mapping...');
    await set(ref(database, `accessCodes/${testAccessCode}`), {
      clientId: testClient.id
    });
    console.log(`  ✅ Access code created: ${testAccessCode}`);
    
    // 4. Create test project
    console.log('\nCreating test project...');
    const testProject = {
      id: 'project-test-001',
      clientId: testClient.id,
      name: 'Website Redesign Project',
      description: 'Complete redesign of company website with modern UI/UX',
      status: 'In Progress',
      progress: 65,
      startDate: '2025-01-15',
      dueDate: '2025-03-30',
      budget: 45000,
      teamIds: ['team-001', 'team-002', 'team-003'],
      milestones: [
        {
          id: 'milestone-001',
          title: 'Design Phase',
          description: 'Complete UI/UX designs and wireframes',
          status: 'Completed',
          dueDate: '2025-02-01',
          completedDate: '2025-01-28'
        },
        {
          id: 'milestone-002',
          title: 'Development Phase',
          description: 'Frontend and backend development',
          status: 'In Progress',
          dueDate: '2025-03-01',
          completedDate: null
        },
        {
          id: 'milestone-003',
          title: 'Testing & Launch',
          description: 'QA testing and production deployment',
          status: 'Pending',
          dueDate: '2025-03-30',
          completedDate: null
        }
      ],
      documents: [
        {
          id: 'doc-001',
          name: 'Project Brief.pdf',
          url: '#',
          uploadedAt: Date.now() - 86400000 * 10,
          size: '2.4 MB'
        },
        {
          id: 'doc-002',
          name: 'Design Mockups.fig',
          url: '#',
          uploadedAt: Date.now() - 86400000 * 5,
          size: '15.8 MB'
        }
      ],
      createdAt: Date.now() - 86400000 * 15,
      updatedAt: Date.now()
    };
    
    await set(ref(database, `projects/${testProject.id}`), testProject);
    console.log(`  ✅ Added project: ${testProject.name}`);
    console.log(`     - Status: ${testProject.status}`);
    console.log(`     - Progress: ${testProject.progress}%`);
    console.log(`     - Milestones: ${testProject.milestones.length}`);
    
    // 5. Create test invoice
    console.log('\nCreating test invoice...');
    const testInvoice = {
      id: 'INV-001234',
      clientId: testClient.id,
      projectId: testProject.id,
      amount: 22500,
      status: 'Paid',
      dueDate: '2025-02-15',
      issuedDate: '2025-01-15',
      description: 'Phase 1 - Design & Planning',
      createdAt: Date.now() - 86400000 * 10
    };
    
    await set(ref(database, `invoices/${testInvoice.id}`), testInvoice);
    console.log(`  ✅ Added invoice: ${testInvoice.id} - $${testInvoice.amount.toLocaleString()}`);
    
    // 6. Create test notifications
    console.log('\nCreating test notifications...');
    const testNotifications = [
      {
        id: 'notif-001',
        userId: testClient.id,
        title: 'Milestone Completed',
        message: 'Design Phase milestone has been completed ahead of schedule!',
        type: 'success',
        read: false,
        createdAt: Date.now() - 86400000 * 2
      },
      {
        id: 'notif-002',
        userId: testClient.id,
        title: 'Project Update',
        message: 'Development phase is now 65% complete. On track for March 1st deadline.',
        type: 'info',
        read: false,
        createdAt: Date.now() - 86400000
      }
    ];
    
    for (const notif of testNotifications) {
      await set(ref(database, `notifications/${notif.id}`), notif);
      console.log(`  ✅ Added notification: ${notif.title}`);
    }
    
    console.log('\n✅ Test data seeding completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('═══════════════════════════════════════════════');
    console.log(`Access Code: ${testAccessCode}`);
    console.log(`Client Name: ${testClient.name}`);
    console.log(`Company: ${testClient.companyName}`);
    console.log(`Project: ${testProject.name}`);
    console.log(`Progress: ${testProject.progress}%`);
    console.log('═══════════════════════════════════════════════');
    console.log('\nYou can now test client login at: http://localhost:3001');
    console.log(`Use access code: ${testAccessCode}`);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding data:', error);
    process.exit(1);
  }
}

// Run the seeding
seedTestData();
