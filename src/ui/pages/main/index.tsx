import { useCallback } from "react";
import { Form } from "antd";
import { FormData } from "src/types/form-data.type";

// Components
import { DataForm, DataTable, ImagePreviewModal } from "src/ui/components";

// Hooks
import { useImagePreview, useTableData } from "src/ui/hooks";

// Utils
import { createTableRecord } from "src/ui/utils";

const MainPage = () => {
  const [form] = Form.useForm();
  const { data, addRecord, deleteRecord } = useTableData();
  const { previewVisible, previewImages, handlePreview, closePreview } =
    useImagePreview();

  const handleSave = useCallback(
    async (values: FormData) => {
      const newRecord = createTableRecord(values);
      addRecord(newRecord);
      form.resetFields();
    },
    [addRecord, form]
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-right">
          نموذج حفظ الصور والبيانات
        </h1>

        <DataForm form={form} onSave={handleSave} />
        <DataTable
          data={data}
          onPreview={handlePreview}
          onDelete={deleteRecord}
        />
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
