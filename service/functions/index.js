const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Get Firestore instance
const db = admin.firestore();

// Example HTTP function for API endpoints
exports.api = functions.https.onRequest((req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  // Simple API endpoint
  if (req.method === 'GET' && req.path === '/status') {
    res.json({ 
      status: 'OJT Management System API is running!',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
    return;
  }

  // Default response
  res.status(404).json({ error: 'Endpoint not found' });
});

// Cloud Function triggered when a new user is created
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  try {
    // Create user document in Firestore
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      displayName: user.displayName || '',
      role: 'intern', // Default role
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true
    });

    console.log(`User document created for ${user.email}`);
  } catch (error) {
    console.error('Error creating user document:', error);
  }
});

// Cloud Function triggered when a user is deleted
exports.onUserDelete = functions.auth.user().onDelete(async (user) => {
  try {
    // Delete user document from Firestore
    await db.collection('users').doc(user.uid).delete();
    
    console.log(`User document deleted for ${user.email}`);
  } catch (error) {
    console.error('Error deleting user document:', error);
  }
});

// Cloud Function to handle timesheet submissions
exports.onTimesheetCreate = functions.firestore
  .document('timesheets/{timesheetId}')
  .onCreate(async (snap, context) => {
    const timesheetData = snap.data();
    const timesheetId = context.params.timesheetId;

    try {
      // You can add business logic here, such as:
      // - Sending notifications to supervisors
      // - Calculating overtime hours
      // - Validating timesheet data
      
      console.log(`New timesheet created: ${timesheetId} for user: ${timesheetData.userId}`);
      
      // Example: Update user's total hours
      const userRef = db.collection('users').doc(timesheetData.userId);
      await userRef.update({
        lastTimesheetSubmission: admin.firestore.FieldValue.serverTimestamp()
      });

    } catch (error) {
      console.error('Error processing timesheet creation:', error);
    }
  });

// Cloud Function to handle leave request approvals
exports.onLeaveRequestUpdate = functions.firestore
  .document('leaveRequests/{requestId}')
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();
    const requestId = context.params.requestId;

    // Check if status changed to approved or rejected
    if (beforeData.status !== afterData.status && 
        (afterData.status === 'approved' || afterData.status === 'rejected')) {
      
      try {
        // You can add notification logic here
        // For example, send email or push notification to the user
        
        console.log(`Leave request ${requestId} status changed to: ${afterData.status}`);
        
        // Update user document with leave request status
        const userRef = db.collection('users').doc(afterData.userId);
        await userRef.update({
          lastLeaveRequestUpdate: admin.firestore.FieldValue.serverTimestamp()
        });

      } catch (error) {
        console.error('Error processing leave request update:', error);
      }
    }
  });

// Scheduled function to run daily cleanup tasks
exports.dailyCleanup = functions.pubsub.schedule('0 2 * * *') // Runs at 2 AM daily
  .timeZone('America/New_York')
  .onRun(async (context) => {
    try {
      // Example cleanup tasks:
      // - Archive old timesheets
      // - Send reminder notifications
      // - Generate daily reports
      
      console.log('Running daily cleanup tasks...');
      
      // Example: Delete old temporary data (older than 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const oldDataQuery = db.collection('temporaryData')
        .where('createdAt', '<', thirtyDaysAgo);
      
      const snapshot = await oldDataQuery.get();
      const batch = db.batch();
      
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`Deleted ${snapshot.size} old temporary records`);
      
    } catch (error) {
      console.error('Error in daily cleanup:', error);
    }
  });

// HTTP function for generating reports
exports.generateReport = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  // Verify user has supervisor role
  const userDoc = await db.collection('users').doc(context.auth.uid).get();
  if (!userDoc.exists || userDoc.data().role !== 'supervisor') {
    throw new functions.https.HttpsError('permission-denied', 'Only supervisors can generate reports');
  }

  try {
    const { reportType, startDate, endDate } = data;
    
    // Generate report based on type
    let reportData = {};
    
    switch (reportType) {
      case 'timesheet':
        // Generate timesheet report
        const timesheetQuery = db.collection('timesheets')
          .where('date', '>=', startDate)
          .where('date', '<=', endDate);
        const timesheetSnapshot = await timesheetQuery.get();
        reportData = timesheetSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        break;
        
      case 'leave':
        // Generate leave report
        const leaveQuery = db.collection('leaveRequests')
          .where('createdAt', '>=', new Date(startDate))
          .where('createdAt', '<=', new Date(endDate));
        const leaveSnapshot = await leaveQuery.get();
        reportData = leaveSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        break;
        
      default:
        throw new functions.https.HttpsError('invalid-argument', 'Invalid report type');
    }

    return {
      success: true,
      reportType,
      startDate,
      endDate,
      data: reportData,
      generatedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error generating report:', error);
    throw new functions.https.HttpsError('internal', 'Error generating report');
  }
});
