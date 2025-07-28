import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";

export const testFirebaseConnection = async () => {
  try {
    console.log("Testing Firebase connection...");

    // Test basic connection
    const testCollection = collection(db, "test");
    const snapshot = await getDocs(testCollection);

    console.log("✅ Firebase connection successful!");
    console.log("Database instance:", db);
    console.log("Test collection snapshot:", snapshot);

    return true;
  } catch (error: unknown) {
    let code = undefined;
    let errMsg = "خطأ غير معروف";
    let stack = undefined;
    if (error && typeof error === "object") {
      code = "code" in error ? (error as { code?: string }).code : undefined;
      errMsg = error instanceof Error ? error.message : errMsg;
      stack =
        "stack" in error ? (error as { stack?: string }).stack : undefined;
    }
    console.error("❌ Firebase connection failed:", error);
    console.error("Error details:", {
      code,
      message: errMsg,
      stack,
    });
    return false;
  }
};

export const logFirebaseConfig = () => {
  console.log("Firebase Configuration Check:");
  console.log("API Key exists:", !!import.meta.env.VITE_FIREBASE_API_KEY);
  console.log("Project ID exists:", !!import.meta.env.VITE_FIREBASE_PROJECT_ID);
  console.log(
    "Auth Domain exists:",
    !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
  );
  console.log(
    "Storage Bucket exists:",
    !!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
  );
  console.log(
    "Messaging Sender ID exists:",
    !!import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
  );
  console.log("App ID exists:", !!import.meta.env.VITE_FIREBASE_APP_ID);
};
