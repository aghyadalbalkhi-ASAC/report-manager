import { Table, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { TableRecord } from "src/types/form-data.type";
import { ActionButtons } from "./ActionButtons";

// Constants
const TABLE_COLUMNS = [
  {
    title: "رقم الطلب",
    dataIndex: "requestNumber",
    key: "requestNumber",
  },
  {
    title: "تاريخ الإنشاء",
    dataIndex: "createdDate",
    key: "createdDate",
    render: (date: string) => (
      <span className="text-sm text-gray-600">{date}</span>
    ),
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
    title: "عدد الصور",
    dataIndex: "images",
    key: "imageCount",
    render: (images: string[]) => (
      <span className="text-sm text-gray-600">{images.length} صورة</span>
    ),
  },
  {
    title: "صور",
    dataIndex: "images",
    key: "images",
    render: (images: string[], record: TableRecord) => {
      if (images.length === 0) {
        return <span className="text-gray-400">لا توجد صور</span>;
      }

      return (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => record.onPreview?.(images)}
          disabled={images.length === 0}
          size="small"
        >
          عرض
        </Button>
      );
    },
  },
];

interface DataTableProps {
  data: TableRecord[];
  onPreview: (images: string[]) => void;
  onDelete: (key: string) => void;
}

export const DataTable = ({ data, onPreview, onDelete }: DataTableProps) => {
  // Add onPreview function to each record for the images column
  const dataWithPreview = data.map((record) => ({
    ...record,
    onPreview,
  }));

  const columns = [
    ...TABLE_COLUMNS,
    {
      title: "الإجراءات",
      key: "actions",
      render: (_: string[], record: TableRecord) => (
        <ActionButtons
          record={record}
          onPreview={onPreview}
          onDelete={onDelete}
        />
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md">
      <Table
        columns={columns}
        dataSource={dataWithPreview}
        pagination={false}
        className="rtl"
        rowClassName="hover:bg-gray-50"
      />
    </div>
  );
};
