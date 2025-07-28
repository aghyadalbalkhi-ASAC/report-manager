import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import { FirebaseError } from "firebase/app";
import { storage } from "../config/firebase";
import type { UploadFile } from "antd/es/upload/interface";

const STORAGE_FOLDER = "reports";

// Upload images to Firebase Storage
export const uploadImagesToStorage = async (
  files: UploadFile[]
): Promise<string[]> => {
  try {
    console.log("🔄 Starting image upload to Firebase Storage...");
    const uploadPromises = files.map(async (file, index) => {
      if (!file.originFileObj) {
        throw new Error("No file object found");
      }

      // Create unique filename
      const timestamp = Date.now();
      const fileName = `${STORAGE_FOLDER}/${timestamp}_${index}_${file.name}`;
      const storageRef = ref(storage, fileName);

      console.log(
        `🔄 Uploading image ${index + 1}/${files.length}: ${file.name}`
      );

      // Upload file
      const snapshot = await uploadBytes(storageRef, file.originFileObj);

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log(`✅ Image ${index + 1} uploaded successfully:`, downloadURL);
      return downloadURL;
    });

    const downloadURLs = await Promise.all(uploadPromises);
    console.log("✅ All images uploaded successfully:", downloadURLs);
    return downloadURLs;
  } catch (error: unknown) {
    if (error instanceof FirebaseError || error instanceof Error) {
      console.error("❌ Error uploading images to Firebase Storage:", error);
      throw new Error(`فشل في رفع الصور: ${error.message || "خطأ غير معروف"}`);
    } else {
      throw new Error("فشل في رفع الصور: خطأ غير معروف");
    }
  }
};

// Delete images from Firebase Storage
export const deleteImagesFromStorage = async (
  imageUrls: string[]
): Promise<void> => {
  try {
    console.log("🔄 Starting image deletion from Firebase Storage...");

    const deletePromises = imageUrls.map(async (url) => {
      try {
        // Extract the file path from the URL
        const urlObj = new URL(url);
        const pathSegments = urlObj.pathname.split("/");
        const filePath = pathSegments
          .slice(pathSegments.indexOf("o") + 1)
          .join("/");

        // Decode the path
        const decodedPath = decodeURIComponent(filePath);
        const storageRef = ref(storage, decodedPath);

        console.log("🔄 Deleting image:", decodedPath);
        await deleteObject(storageRef);
        console.log("✅ Image deleted successfully:", decodedPath);
      } catch (error: unknown) {
        if (error instanceof FirebaseError || error instanceof Error) {
          console.error("❌ Error deleting image:", url, error);
        } else {
          console.error("❌ Error deleting image:", url, "Unknown error");
        }
        // Don't throw error for individual image deletion failures
      }
    });

    await Promise.all(deletePromises);
    console.log("✅ All images deleted successfully");
  } catch (error: unknown) {
    if (error instanceof FirebaseError || error instanceof Error) {
      console.error("❌ Error deleting images from Firebase Storage:", error);
      throw new Error(`فشل في حذف الصور: ${error.message || "خطأ غير معروف"}`);
    } else {
      throw new Error("فشل في حذف الصور: خطأ غير معروف");
    }
  }
};

// Get all images for a specific report
export const getImagesForReport = async (
  reportId: string
): Promise<string[]> => {
  try {
    console.log("🔄 Getting images for report:", reportId);

    const reportFolderRef = ref(storage, `${STORAGE_FOLDER}/${reportId}`);
    const result = await listAll(reportFolderRef);

    const downloadURLs = await Promise.all(
      result.items.map(async (itemRef) => {
        return await getDownloadURL(itemRef);
      })
    );

    console.log("✅ Retrieved images for report:", downloadURLs);
    return downloadURLs;
  } catch (error: unknown) {
    if (error instanceof FirebaseError || error instanceof Error) {
      console.error("❌ Error getting images for report:", error);
      throw new Error(`فشل في جلب الصور: ${error.message || "خطأ غير معروف"}`);
    } else {
      throw new Error("فشل في جلب الصور: خطأ غير معروف");
    }
  }
};
