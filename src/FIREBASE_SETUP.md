
# Firebase Setup Guide for Toiral Estimate

This guide will help you connect the Toiral Estimate application to Firebase Realtime Database.

## Prerequisites

- A Google account
- Node.js installed on your machine

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "toiral-estimate")
4. (Optional) Enable Google Analytics
5. Click "Create project"

## Step 2: Enable Realtime Database

1. In the Firebase Console, select your project
2. Click "Build" in the left sidebar
3. Click "Realtime Database"
4. Click "Create Database"
5. Choose your database location (closest to your users)
6. Start in **test mode** for development (we'll secure it later)
7. Click "Enable"

## Step 3: Enable Google Authentication

1. In the Firebase Console, click "Build" > "Authentication"
2. Click "Get started"
3. Click on "Google" in the Sign-in providers list
4. Toggle "Enable"
5. Select a support email
6. Click "Save"

## Step 4: Get Your Firebase Configuration

1. In the Firebase Console, click the gear icon ⚙️ > "Project settings"
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register your app with a nickname (e.g., "toiral-web")
5. Copy the `firebaseConfig` object

## Step 5: Update the Application

Open `lib/firebase.ts` and replace the placeholder config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 6: Install Firebase Dependencies

Run the following command in your project directory:

```bash
npm install firebase
```

## Step 7: Database Rules (Development)

For development, use these permissive rules. Go to Realtime Database > Rules:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

## Step 8: Database Rules (Production)

For production, use these secure rules:

```json
{
  "rules": {
    "clients": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$clientId": {
        ".read": "auth != null || data.child('accessCode').val() == query.accessCode"
      }
    },
    "accessCodes": {
      ".read": true,
      ".write": "auth != null"
    },
    "projects": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "teamMembers": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "invoices": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "notifications": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

## Database Structure

The application uses the following database structure:

```
toiral-estimate/
├── clients/
│   └── {clientId}/
│       ├── id: string
│       ├── accessCode: string (unique)
│       ├── name: string
│       ├── companyName: string
│       ├── email: string
│       ├── phone: string
│       ├── status: "Active" | "Pending" | "Inactive"
│       ├── projectIds: string[]
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── accessCodes/
│   └── {accessCode}/
│       └── clientId: string
│
├── projects/
│   └── {projectId}/
│       ├── id: string
│       ├── clientId: string
│       ├── name: string
│       ├── description: string
│       ├── status: string
│       ├── progress: number
│       ├── startDate: string
│       ├── dueDate: string
│       ├── budget: number
│       ├── teamIds: string[]
│       ├── milestones: array
│       ├── documents: array
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── teamMembers/
│   └── {memberId}/
│       ├── id: string
│       ├── name: string
│       ├── role: string
│       ├── email: string
│       └── projectCount: number
│
├── invoices/
│   └── {invoiceId}/
│       ├── id: string
│       ├── clientId: string
│       ├── projectId: string
│       ├── amount: number
│       ├── status: string
│       ├── date: string
│       └── dueDate: string
│
└── notifications/
    └── {notificationId}/
        ├── id: string
        ├── userId: string
        ├── type: string
        ├── title: string
        ├── description: string
        ├── read: boolean
        └── createdAt: timestamp
```

## Testing the Connection

1. Start your application
2. Open the browser console
3. If Firebase is configured correctly, you should see no errors
4. Try creating a new client from the admin panel
5. Check the Firebase Console > Realtime Database to see the data

## Troubleshooting

### "Firebase not configured" message
- Make sure you've replaced the placeholder config in `lib/firebase.ts`
- Verify your API key and project ID are correct

### Authentication errors
- Ensure Google Sign-in is enabled in Firebase Console
- Check that your domain is authorized (Firebase Console > Authentication > Settings > Authorized domains)

### Database permission denied
- Check your database rules
- For development, use the permissive rules above
- Make sure you're authenticated for admin operations

### Data not syncing
- Check your internet connection
- Verify the database URL in your config
- Look for errors in the browser console

## Demo Mode

The application works in "demo mode" when Firebase is not configured:
- Uses mock data stored in memory
- All CRUD operations work locally
- Data resets on page refresh
- Perfect for testing the UI without a database

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Realtime Database Guide](https://firebase.google.com/docs/database)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
