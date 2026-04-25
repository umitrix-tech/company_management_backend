const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

// Initialize Firebase Admin
let firebaseApp;
try {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || path.join(__dirname, "../config/firebase-service-account.json");
  
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin initialized successfully.");
  } else {
    console.warn("Firebase service account file not found. Notifications will be disabled.");
  }
} catch (error) {
  console.error("Error initializing Firebase Admin:", error.message);
}

/**
 * Common function to send notifications
 * @param {string} type - Notification type (e.g., 'LEAVE_APPROVED', 'PERMISSION_REQUEST')
 * @param {object} data - Payload data
 * @param {string|string[]} targetTokens - FCM tokens of the recipient(s)
 */
const sendNotification = async (type, data, targetTokens) => {
  if (!firebaseApp) {
    console.warn("Firebase not initialized. Skipping notification.");
    return;
  }

  if (!targetTokens || (Array.isArray(targetTokens) && targetTokens.length === 0)) {
    console.warn("No target tokens provided for notification.");
    return;
  }

  const message = {
    data: {
      type,
      ...data,
      timestamp: new Date().toISOString(),
    },
    tokens: Array.isArray(targetTokens) ? targetTokens : [targetTokens],
    notification: {
      title: data.title || "New Notification",
      body: data.body || "You have a new message.",
    },
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`Successfully sent ${response.successCount} notifications.`);
    return response;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

module.exports = {
  sendNotification,
};
