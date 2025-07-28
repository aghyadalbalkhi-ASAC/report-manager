import { Form, Input, Upload, Button, message, FormInstance } from "antd";
import { SaveOutlined, InboxOutlined } from "@ant-design/icons";
import { FormData } from "src/types/form-data.type";
import type { UploadProps } from "antd/es/upload/interface";

// Constants
const MAX_IMAGES = 10; // Increased from 5 to 10

// Form validation rules
const FORM_RULES = {
  streetName: [{ required: true, message: "يرجى إدخال اسم الشارع" }],
  neighborhoodName: [{ required: true, message: "يرجى إدخال اسم الحي" }],
  siteLink: [
    { required: true, message: "يرجى إدخال رابط الموقع" },
    { type: "url" as const, message: "يرجى إدخال رابط صحيح" },
  ],
  requestNumber: [{ required: true, message: "يرجى إدخال رقم الطلب" }],
  images: [{ required: true, message: "يرجى اختيار الصور" }],
};

interface DataFormProps {
  form: FormInstance;
  onSave: (values: FormData) => void;
  loading?: boolean;
}

export const DataForm = ({ form, onSave, loading = false }: DataFormProps) => {
  const handleUploadChange: UploadProps["onChange"] = (info) => {
    const { fileList } = info;

    // Check file types
    const invalidFiles = fileList.filter(
      (file) => file.type && !file.type.startsWith("image/")
    );

    if (invalidFiles.length > 0) {
      message.error("يرجى اختيار ملفات صور فقط");
      return;
    }

    // Update form field
    form.setFieldsValue({ images: { fileList } });
  };

  const beforeUpload: UploadProps["beforeUpload"] = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("يمكنك رفع ملفات الصور فقط!");
      return false;
    }

    return false; // Prevent auto upload
  };

  const uploadProps: UploadProps = {
    name: "images",
    multiple: true,
    listType: "picture-card",
    maxCount: MAX_IMAGES,
    beforeUpload,
    onChange: handleUploadChange,
    accept: "image/*",
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
      showDownloadIcon: false,
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <Form
        form={form}
        onFinish={onSave}
        layout="vertical"
        className="space-y-4"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <Form.Item
              name="images"
              label={
                <span>
                  الصور
                  <span className="text-gray-500 text-sm mr-2">
                    (حد أقصى {MAX_IMAGES} صور)
                  </span>
                </span>
              }
              rules={FORM_RULES.images}
            >
              <Upload.Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  انقر أو اسحب الملفات إلى هذه المنطقة للرفع
                </p>
                <p className="ant-upload-hint">
                  يدعم رفع عدة ملفات. الحد الأقصى {MAX_IMAGES} صور
                </p>
              </Upload.Dragger>
            </Form.Item>
          </div>

          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="streetName"
                label="اسم الشارع"
                rules={FORM_RULES.streetName}
              >
                <Input placeholder="اسم الشارع" />
              </Form.Item>

              <Form.Item
                name="neighborhoodName"
                label="اسم الحي"
                rules={FORM_RULES.neighborhoodName}
              >
                <Input placeholder="اسم الحي" />
              </Form.Item>

              <Form.Item
                name="siteLink"
                label="رابط الموقع"
                rules={FORM_RULES.siteLink}
              >
                <Input placeholder="رابط الموقع" />
              </Form.Item>

              <Form.Item
                name="requestNumber"
                label="رقم الطلب / البلاغ"
                rules={FORM_RULES.requestNumber}
              >
                <Input placeholder="رقم الطلب / البلاغ" />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            size="large"
            loading={loading}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "جاري الحفظ..." : "حفظ"}
          </Button>
        </div>
      </Form>
    </div>
  );
};
