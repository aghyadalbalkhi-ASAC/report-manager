import type { UploadFile } from "antd/es/upload/interface";
import { FormData, TableRecord } from "src/types/form-data.type";

export const createImageUrls = (fileList: UploadFile[]): string[] => {
  return fileList.map((file: UploadFile) =>
    URL.createObjectURL(file.originFileObj as Blob)
  );
};

export const createTableRecord = (values: FormData): TableRecord => {
  const fileList = values.images?.fileList || [];
  const imageUrls = createImageUrls(fileList);

  return {
    key: Date.now().toString(),
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
