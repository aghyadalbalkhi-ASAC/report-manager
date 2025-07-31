import { useCallback, useState } from "react";
import { Form, Spin } from "antd";
import { FormData } from "src/types/form-data.type";

// Components
import {
  DataForm,
  DataTable,
  ImagePreviewModal,
  ExportButtons,
} from "src/ui/components";

// Hooks
import { useImagePreview, useTableData } from "src/ui/hooks";

// Utils
import { createTableRecord } from "src/ui/utils";

const MainPage = () => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const { data, loading, addRecord, deleteRecord } = useTableData();
  const { previewVisible, previewImages, closePreview } = useImagePreview();

  const handleSave = useCallback(
    async (values: FormData) => {
      try {
        setSaving(true);
        console.log("🔄 Creating table record...");
        const newRecord = await createTableRecord(values);
        console.log("✅ Table record created:", newRecord);
        await addRecord(newRecord);
        form.resetFields();
      } catch (error: unknown) {
        console.error("❌ Error in handleSave:", error);
        // Error message is already handled in addRecord
      } finally {
        setSaving(false);
      }
    },
    [addRecord, form]
  );

  if (loading && data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="جاري تحميل البيانات..." />
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 text-right">
            نموذج حفظ الصور والبيانات
          </h1>
          <ExportButtons data={data} />
        </div>

        <DataForm form={form} onSave={handleSave} loading={saving} />

        <Spin spinning={loading} tip="جاري التحميل...">
          <DataTable data={data} onDelete={deleteRecord} />
        </Spin>
      </div>

      <ImagePreviewModal
        visible={previewVisible}
        images={previewImages}
        onClose={closePreview}
      />
    </div>
  );
};

export default MainPage;
