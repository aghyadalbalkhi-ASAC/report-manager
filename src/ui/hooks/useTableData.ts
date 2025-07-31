import { useState, useCallback, useEffect } from "react";
import { message } from "antd";
import { TableRecord } from "src/types/form-data.type";
import {
  addRecordToFirebase,
  getRecordsFromFirebase,
  deleteRecordFromFirebase,
} from "src/services/firebaseService";

export const useTableData = () => {
  const [data, setData] = useState<TableRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Load data from Firebase on component mount
  useEffect(() => {
    loadDataFromFirebase();
  }, []);

  const loadDataFromFirebase = async () => {
    setLoading(true);
    try {
      console.log("🔄 Starting to load data from Firebase...");
      const records = await getRecordsFromFirebase();
      console.log("✅ Data loaded successfully:", records);
      setData(records);
    } catch (error: unknown) {
      console.error("❌ Error loading data from Firebase:", error);
      let code: string | undefined = undefined;
      let errMsg = "خطأ غير معروف";
      let name: string | undefined = undefined;
      let stack: string | undefined = undefined;
      if (error && typeof error === "object") {
        code = "code" in error ? (error as { code?: string }).code : undefined;
        errMsg = error instanceof Error ? error.message : errMsg;
        name = "name" in error ? (error as { name?: string }).name : undefined;
        stack =
          "stack" in error ? (error as { stack?: string }).stack : undefined;
      }
      console.error("Error details:", {
        code,
        message: errMsg,
        name,
        stack,
      });
      // Show more specific error messages
      if (code === "permission-denied") {
        message.error("خطأ في الصلاحيات - تأكد من إعدادات Firestore");
      } else if (code === "unavailable") {
        message.error("Firebase غير متاح - تحقق من اتصال الإنترنت");
      } else if (code === "not-found") {
        message.error("المشروع غير موجود - تحقق من إعدادات Firebase");
      } else {
        message.error(`فشل في تحميل البيانات: ${errMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const addRecord = useCallback(async (record: Omit<TableRecord, "key">) => {
    setLoading(true);
    try {
      console.log("🔄 Adding record to Firebase:", record);
      const recordId = await addRecordToFirebase(record);
      const newRecord: TableRecord = {
        ...record,
        key: recordId,
      };
      setData((prev) => [newRecord, ...prev]); // Add to beginning since we order by createdAt desc
      message.success("تم حفظ البيانات بنجاح");
    } catch (error: unknown) {
      console.error("❌ Error adding record:", error);
      const errMsg = error instanceof Error ? error.message : "خطأ غير معروف";
      message.error(`فشل في حفظ البيانات: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRecord = useCallback(
    async (key: string) => {
      try {
        setLoading(true);
        console.log("🔄 Deleting record:", key);

        // Find the record to get its pdfUrl
        const record = data.find((item) => item.key === key);
        if (!record) {
          throw new Error("Record not found");
        }

        await deleteRecordFromFirebase(key, record.pdfUrl);
        setData((prevData) => prevData.filter((item) => item.key !== key));
        message.success("تم حذف السجل بنجاح");
      } catch (error: unknown) {
        console.error("❌ Error deleting record:", error);
        let errMsg = "خطأ غير معروف";
        if (error && typeof error === "object") {
          errMsg = error instanceof Error ? error.message : errMsg;
        }
        message.error(`فشل في حذف السجل: ${errMsg}`);
      } finally {
        setLoading(false);
      }
    },
    [data]
  );

  return {
    data,
    loading,
    addRecord,
    deleteRecord,
    refreshData: loadDataFromFirebase,
  };
};
