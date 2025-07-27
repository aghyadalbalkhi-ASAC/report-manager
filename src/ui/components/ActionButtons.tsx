import { Button, message, Modal } from "antd";
import { DeleteOutlined, FilePdfOutlined } from "@ant-design/icons";
import { TableRecord } from "src/types/form-data.type";
import { exportToPDF } from "src/ui/utils/pdfUtils";

interface ActionButtonsProps {
  record: TableRecord;
  onDelete: (key: string) => void;
}

export const ActionButtons = ({ record, onDelete }: ActionButtonsProps) => {
  const handleExportPDF = async () => {
    try {
      await exportToPDF(record);
      message.success("تم إنشاء التقرير بنجاح");
    } catch (error) {
      message.error("فشل في إنشاء التقرير");
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "تأكيد الحذف",
      content: `هل أنت متأكد من حذف الطلب رقم "${record.requestNumber}"؟`,
      okText: "نعم، احذف",
      cancelText: "إلغاء",
      okType: "danger",
      onOk() {
        onDelete(record.key);
        message.success("تم حذف الطلب بنجاح");
      },
    });
  };

  return (
    <div className="flex gap-2">
      <Button
        type="link"
        icon={<FilePdfOutlined />}
        onClick={handleExportPDF}
        size="small"
      >
        تصدير PDF
      </Button>
      <Button
        type="link"
        danger
        icon={<DeleteOutlined />}
        onClick={handleDelete}
        size="small"
      >
        حذف
      </Button>
    </div>
  );
};
