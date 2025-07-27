import { Table, Image } from "antd";
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
    title: "تاريخ الإنشاء",
    dataIndex: "createdDate",
    key: "createdDate",
    render: (date: string) => (
      <span className="text-sm text-gray-600">{date}</span>
    ),
  },
  {
    title: "صور",
    dataIndex: "images",
    key: "images",
    render: (images: string[]) => {
      if (images.length === 0) {
        return <span className="text-gray-400">لا توجد صور</span>;
      }

      return (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">{images.length} صورة</div>
          <div className="flex flex-wrap gap-1">
            {images.slice(0, 3).map((image, index) => (
              <div
                key={index}
                className="w-12 h-12 rounded border border-gray-200 overflow-hidden"
              >
                <Image
                  src={image}
                  alt={`صورة مصغرة ${index + 1}`}
                  className="w-full h-full object-cover"
                  preview={false}
                />
              </div>
            ))}
            {images.length > 3 && (
              <div className="w-12 h-12 rounded border border-gray-200 bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                +{images.length - 3}
              </div>
            )}
          </div>
        </div>
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
        dataSource={data}
        pagination={false}
        className="rtl"
        rowClassName="hover:bg-gray-50"
      />
    </div>
  );
};
