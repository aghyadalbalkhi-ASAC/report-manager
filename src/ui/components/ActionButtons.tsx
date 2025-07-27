import { Button, message } from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { TableRecord } from "src/types/form-data.type";
import { exportToPDF } from "src/ui/utils/pdfUtils";

interface ActionButtonsProps {
  record: TableRecord;
  onPreview: (images: string[]) => void;
  onDelete: (key: string) => void;
}

export const ActionButtons = ({
  record,
  onPreview,
  onDelete,
}: ActionButtonsProps) => {
  const handleExportPDF = async () => {
    try {
      await exportToPDF(record);
      message.success("تم إنشاء التقرير بنجاح");
    } catch (error) {
      message.error("فشل في إنشاء التقرير");
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        type="link"
        icon={<EyeOutlined />}
        onClick={() => onPreview(record.images)}
        disabled={record.images.length === 0}
        size="small"
      >
        عرض
      </Button>
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
        onClick={() => onDelete(record.key)}
        size="small"
      >
        حذف
      </Button>
    </div>
  );
};
