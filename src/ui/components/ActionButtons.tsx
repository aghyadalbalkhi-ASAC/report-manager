import React from "react";
import { Button, Modal, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { TableRecord } from "src/types/form-data.type";

interface ActionButtonsProps {
  record: TableRecord;
  onDelete: (key: string) => Promise<void>;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  record,
  onDelete,
}) => {
  const handleDelete = () => {
    Modal.confirm({
      title: "تأكيد الحذف",
      content: `هل أنت متأكد من حذف الطلب رقم "${record.requestNumber}"؟`,
      okText: "حذف",
      okType: "danger",
      cancelText: "إلغاء",
      onOk: async () => {
        try {
          await onDelete(record.key);
        } catch (error) {
          console.error("Error deleting record:", error);
        }
      },
    });
  };

  return (
    <Space>
      <Button
        danger
        icon={<DeleteOutlined />}
        onClick={handleDelete}
        size="small"
      >
        حذف
      </Button>
    </Space>
  );
};
