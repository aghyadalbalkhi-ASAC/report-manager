import type { UploadFile } from "antd/es/upload/interface";
import { FormData, TableRecord } from "src/types/form-data.type";
import { uploadImagesToStorage } from "src/services/storageService";

export const createImageUrls = async (
  fileList: UploadFile[]
): Promise<string[]> => {
  try {
    console.log("🔄 Uploading images to Firebase Storage...");
    const imageUrls = await uploadImagesToStorage(fileList);
    console.log("✅ Images uploaded successfully:", imageUrls);
    return imageUrls;
  } catch (error) {
    console.error("❌ Error uploading images:", error);
    throw error;
  }
};

export const createTableRecord = async (
  values: FormData
): Promise<Omit<TableRecord, "key">> => {
  const fileList = values.images?.fileList || [];
  const imageUrls = await createImageUrls(fileList);

  return {
    requestNumber: values.requestNumber,
    siteLink: values.siteLink,
    neighborhoodName: values.neighborhoodName,
    streetName: values.streetName,
    images: imageUrls,
    createdDate: new Date().toLocaleString("ar-SA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };
};
