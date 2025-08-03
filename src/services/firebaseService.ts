import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { db } from "../config/firebase";
import { TableRecord } from "src/types/form-data.type";

const COLLECTION_NAME = "reports";

// Add a new record to Firebase
export const addRecordToFirebase = async (
  record: Omit<TableRecord, "key">
): Promise<string> => {
  try {
    console.log("🔄 Adding record to Firebase...");
    const docRef = await addDoc(collection(db, COLLECTION_NAME), record);
    console.log("✅ Record added successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error("❌ Firebase error adding record:", error);
      throw new Error(`فشل في حفظ البيانات: ${error.message}`);
    } else if (error instanceof Error) {
      console.error("❌ Error adding record:", error);
      throw new Error(`فشل في حفظ البيانات: ${error.message}`);
    } else {
      console.error("❌ Unknown error adding record:", error);
      throw new Error("فشل في حفظ البيانات: خطأ غير معروف");
    }
  }
};

// Get all records from Firebase
export const getRecordsFromFirebase = async (): Promise<TableRecord[]> => {
  try {
    console.log("🔄 Getting records from Firebase...");
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("createdDate", "desc")
    );
    const querySnapshot = await getDocs(q);

    const records: TableRecord[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      records.push({
        key: doc.id,
        requestNumber: data.requestNumber,
        siteLink: data.siteLink,
        images: data.images || [],
        createdDate: data.createdDate,
        pdfUrl: data.pdfUrl,
      });
    });

    console.log("✅ Records retrieved successfully:", records.length);
    return records;
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error("❌ Firebase error getting records:", error);
      throw new Error(`فشل في تحميل البيانات: ${error.message}`);
    } else if (error instanceof Error) {
      console.error("❌ Error getting records:", error);
      throw new Error(`فشل في تحميل البيانات: ${error.message}`);
    } else {
      console.error("❌ Unknown error getting records:", error);
      throw new Error("فشل في تحميل البيانات: خطأ غير معروف");
    }
  }
};

// Delete a record from Firebase
export const deleteRecordFromFirebase = async (
  key: string,
  pdfUrl?: string
): Promise<void> => {
  try {
    console.log("🔄 Deleting record from Firebase...");

    // Delete the document
    await deleteDoc(doc(db, COLLECTION_NAME, key));
    console.log("✅ Record deleted successfully");

    // Delete the PDF from storage if it exists
    if (pdfUrl) {
      try {
        const { deleteObject, ref } = await import("firebase/storage");
        const { storage } = await import("../config/firebase");

        // Extract the file path from the URL
        const urlObj = new URL(pdfUrl);
        const pathSegments = urlObj.pathname.split("/");
        const filePath = pathSegments
          .slice(pathSegments.indexOf("o") + 1)
          .join("/");

        // Decode the path
        const decodedPath = decodeURIComponent(filePath);
        const storageRef = ref(storage, decodedPath);

        console.log("🔄 Deleting PDF from storage:", decodedPath);
        await deleteObject(storageRef);
        console.log("✅ PDF deleted successfully from storage");
      } catch (storageError: unknown) {
        console.error("❌ Error deleting PDF from storage:", storageError);
        // Don't throw error for storage deletion failure
      }
    }
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error("❌ Firebase error deleting record:", error);
      throw new Error(`فشل في حذف البيانات: ${error.message}`);
    } else if (error instanceof Error) {
      console.error("❌ Error deleting record:", error);
      throw new Error(`فشل في حذف البيانات: ${error.message}`);
    } else {
      console.error("❌ Unknown error deleting record:", error);
      throw new Error("فشل في حذف البيانات: خطأ غير معروف");
    }
  }
};
