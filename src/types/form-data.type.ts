import type { UploadFile } from "antd/es/upload/interface";

export interface FormData {
  siteLink: string;
  requestNumber: string;
  images: {
    fileList: UploadFile[];
  };
}

export interface TableRecord {
  key: string;
  requestNumber: string;
  siteLink: string;
  images?: string[]; // Optional - not stored in Firebase
  createdDate: string;
  pdfUrl?: string;
  onPreview?: (images: string[]) => void;
}
