import { Button, message } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import { TableRecord } from "src/types/form-data.type";
import { exportToExcel } from "src/ui/utils/excelUtils";

interface ExportButtonsProps {
  data: TableRecord[];
}

export const ExportButtons = ({ data }: ExportButtonsProps) => {
  const handleExportExcel = async () => {
    try {
      if (data.length === 0) {
        message.warning("لا توجد بيانات للتصدير");
        return;
      }

      await exportToExcel(data);
      message.success("تم تصدير البيانات إلى Excel بنجاح");
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "خطأ غير معروف";
      message.error(`فشل في تصدير البيانات: ${errMsg}`);
    }
  };

  return (
    <Button
      icon={<FileExcelOutlined />}
      type="primary"
      onClick={handleExportExcel}
      disabled={data.length === 0}
    >
      تصدير إلى Excel
    </Button>
  );
};
