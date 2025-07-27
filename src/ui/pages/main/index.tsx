import { useState } from "react";
import { Form, Input, Upload, Button, Table, Modal, Image } from "antd";
import {
  UploadOutlined,
  SaveOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { FormData, TableRecord } from "src/types/form-data.type";

const MainPage = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<TableRecord[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleSave = async (values: FormData) => {
    // Handle the file list from Upload component
    const fileList = values.images?.fileList || [];
    const imageUrls = fileList.map((file: UploadFile) =>
      URL.createObjectURL(file.originFileObj as Blob)
    );

    const newRecord: TableRecord = {
      key: Date.now().toString(),
      requestNumber: values.requestNumber,
      siteLink: values.siteLink,
      neighborhoodName: values.neighborhoodName,
      streetName: values.streetName,
      images: imageUrls,
    };

    setData([...data, newRecord]);
    form.resetFields();
  };

  const handleDelete = (key: string) => {
    setData(data.filter((item) => item.key !== key));
  };

  const handlePreview = (images: string[]) => {
    setPreviewImages(images);
    setPreviewVisible(true);
  };

  const columns = [
    {
      title: "رقم الطلب",
      dataIndex: "requestNumber",
      key: "requestNumber",
    },
    {
      title: "رابط الموقع",
      dataIndex: "siteLink",
      key: "siteLink",
      render: (text: string) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: "اسم الحي",
      dataIndex: "neighborhoodName",
      key: "neighborhoodName",
    },
    {
      title: "اسم الشارع",
      dataIndex: "streetName",
      key: "streetName",
    },
    {
      title: "صور",
      dataIndex: "images",
      key: "images",
      render: (images: string[]) => <span>{images.length} صور</span>,
    },
    {
      title: "عرض",
      key: "view",
      render: (_: string[], record: TableRecord) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handlePreview(record.images)}
          disabled={record.images.length === 0}
        >
          عرض
        </Button>
      ),
    },
    {
      title: "حذف",
      key: "delete",
      render: (_: string[], record: TableRecord) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.key)}
        >
          حذف
        </Button>
      ),
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-right">
          نموذج حفظ الصور والبيانات
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <Form
            form={form}
            onFinish={handleSave}
            layout="vertical"
            className="space-y-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <Form.Item
                  name="images"
                  label="الصور"
                  rules={[{ required: true, message: "يرجى اختيار الصور" }]}
                >
                  <Upload
                    listType="picture"
                    maxCount={5}
                    beforeUpload={() => false}
                    accept="image/*"
                  >
                    <Button icon={<UploadOutlined />}>اختيار الملفات</Button>
                  </Upload>
                </Form.Item>
              </div>

              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item
                    name="streetName"
                    label="اسم الشارع"
                    rules={[
                      { required: true, message: "يرجى إدخال اسم الشارع" },
                    ]}
                  >
                    <Input placeholder="اسم الشارع" />
                  </Form.Item>

                  <Form.Item
                    name="neighborhoodName"
                    label="اسم الحي"
                    rules={[{ required: true, message: "يرجى إدخال اسم الحي" }]}
                  >
                    <Input placeholder="اسم الحي" />
                  </Form.Item>

                  <Form.Item
                    name="siteLink"
                    label="رابط الموقع"
                    rules={[
                      { required: true, message: "يرجى إدخال رابط الموقع" },
                      { type: "url", message: "يرجى إدخال رابط صحيح" },
                    ]}
                  >
                    <Input placeholder="رابط الموقع" />
                  </Form.Item>

                  <Form.Item
                    name="requestNumber"
                    label="رقم الطلب / البلاغ"
                    rules={[
                      { required: true, message: "يرجى إدخال رقم الطلب" },
                    ]}
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
                className="bg-blue-600 hover:bg-blue-700"
              >
                حفظ
              </Button>
            </div>
          </Form>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            className="rtl"
          />
        </div>
      </div>

      <Modal
        open={previewVisible}
        title="معاينة الصور"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
      >
        <div className="grid grid-cols-2 gap-4">
          {previewImages.map((image, index) => (
            <div key={index} className="aspect-square">
              <Image
                src={image}
                alt={`صورة ${index + 1}`}
                className="w-full h-full object-cover rounded"
              />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default MainPage;
