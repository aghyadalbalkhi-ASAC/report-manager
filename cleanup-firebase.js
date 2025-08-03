/* eslint-env node */
// Firebase cleanup script to remove neighborhoodName and streetName fields
// Run this script once to clean up existing data in Firebase

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

// Your Firebase config (replace with your actual config)
const firebaseConfig = {
  // Add your Firebase config here
  // apiKey: "your-api-key",
  // authDomain: "your-auth-domain",
  // projectId: "your-project-id",
  // storageBucket: "your-storage-bucket",
  // messagingSenderId: "your-messaging-sender-id",
  // appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTION_NAME = "reports"; // Replace with your actual collection name

async function cleanupFirebaseData() {
  try {
    console.log("🔄 Starting Firebase data cleanup...");

    // Get all documents from the collection
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));

    console.log(`📊 Found ${querySnapshot.size} documents to process`);

    let processedCount = 0;
    let errorCount = 0;

    // Process each document
    for (const document of querySnapshot.docs) {
      try {
        const data = document.data();

        // Check if the document has the fields we want to remove
        if (data.neighborhoodName || data.streetName) {
          console.log(`🔄 Processing document: ${document.id}`);

          // Create update object with fields to remove
          const updateData = {};

          // Remove the fields by setting them to undefined (Firebase will remove them)
          if (data.neighborhoodName) {
            updateData.neighborhoodName = undefined;
          }
          if (data.streetName) {
            updateData.streetName = undefined;
          }

          // Update the document
          await updateDoc(doc(db, COLLECTION_NAME, document.id), updateData);

          console.log(`✅ Successfully cleaned document: ${document.id}`);
          processedCount++;
        } else {
          console.log(
            `⏭️  Skipping document ${document.id} (no fields to remove)`
          );
        }
      } catch (error) {
        console.error(`❌ Error processing document ${document.id}:`, error);
        errorCount++;
      }
    }

    console.log("\n🎉 Cleanup completed!");
    console.log(`✅ Successfully processed: ${processedCount} documents`);
    console.log(`❌ Errors: ${errorCount} documents`);
    console.log(`📊 Total documents: ${querySnapshot.size}`);

    return { processedCount, errorCount, totalDocuments: querySnapshot.size };
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    throw error;
  }
}

// Run the cleanup
cleanupFirebaseData()
  .then((result) => {
    console.log("🏁 Cleanup script finished successfully");
    console.log("📋 Final Results:", result);
  })
  .catch((error) => {
    console.error("💥 Cleanup script failed:", error);
    console.error("❌ Please check your Firebase configuration and try again");
  });
