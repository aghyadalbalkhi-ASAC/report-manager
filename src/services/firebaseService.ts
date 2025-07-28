import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { db } from "../config/firebase";
import { TableRecord } from "../types/form-data.type";
import { deleteImagesFromStorage } from "./storageService";

const COLLECTION_NAME = "reports";

// Add a new record to Firebase
export const addRecordToFirebase = async (record: Omit<TableRecord, "key">) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...record,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error("❌ Error adding record to Firebase:", error);
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        name: error.name,
      });
      throw new Error(
        `فشل في حفظ البيانات: ${error.message || "خطأ غير معروف"}`
      );
    } else {
      throw new Error("فشل في حفظ البيانات: خطأ غير معروف");
    }
  }
};

// Get all records from Firebase
export const getRecordsFromFirebase = async (): Promise<TableRecord[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    const records: TableRecord[] = [];
    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      records.push({
        key: doc.id,
        requestNumber: data.requestNumber,
        siteLink: data.siteLink,
        neighborhoodName: data.neighborhoodName,
        streetName: data.streetName,
        images: data.images,
        createdDate: data.createdDate,
      });
    });

    return records;
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error("❌ Error getting records from Firebase:", error);
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        name: error.name,
      });
      throw new Error(
        `فشل في جلب البيانات: ${error.message || "خطأ غير معروف"}`
      );
    } else {
      throw new Error("فشل في جلب البيانات: خطأ غير معروف");
    }
  }
};

// Delete a record from Firebase
export const deleteRecordFromFirebase = async (
  recordId: string,
  imageUrls: string[] = []
) => {
  try {
    // Delete the record from Firestore
    await deleteDoc(doc(db, COLLECTION_NAME, recordId));
    // Delete associated images from Storage if any
    if (imageUrls.length > 0) {
      await deleteImagesFromStorage(imageUrls);
    }
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error("❌ Error deleting record from Firebase:", error);
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        name: error.name,
      });
      throw new Error(
        `فشل في حذف البيانات: ${error.message || "خطأ غير معروف"}`
      );
    } else {
      throw new Error("فشل في حذف البيانات: خطأ غير معروف");
    }
  }
};
