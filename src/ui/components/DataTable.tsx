import React, { useState, useMemo } from "react";
import { Table, Input, Button, Typography } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import { ShareAltOutlined } from "@ant-design/icons";
import { TableRecord } from "src/types/form-data.type";
import { ActionButtons } from "./ActionButtons";

const { Search } = Input;
const { Text } = Typography;

interface DataTableProps {
  data: TableRecord[];
  onDelete: (key: string) => Promise<void>;
  onPreview?: (images: string[]) => void;
}

// Share PDF function
const handleSharePDF = async (record: TableRecord) => {
  if (!record.pdfUrl) {
    console.error("No PDF URL available");
    return;
  }

  try {
    // Check if Web Share API is available (mobile browsers)
    if (navigator.share) {
      try {
        // Try to download the file first and then share it
        const response = await fetch(record.pdfUrl);
        const blob = await response.blob();
        const file = new File([blob], `تقرير_${record.requestNumber}.pdf`, {
          type: "application/pdf",
        });

        // Share the file directly (works on mobile)
        await navigator.share({
          title: `تقرير ${record.requestNumber}`,
          text: `تقرير البيانات - رقم الطلب: ${record.requestNumber}`,
          files: [file],
        });
      } catch (fileShareError) {
        // If file sharing fails, fall back to URL sharing
        console.log(
          "File sharing failed, falling back to URL sharing:",
          fileShareError
        );
        await navigator.share({
          title: `تقرير ${record.requestNumber}`,
          text: `تقرير البيانات - رقم الطلب: ${record.requestNumber}`,
          url: record.pdfUrl,
        });
      }
    } else {
      // Fallback for desktop or browsers without Web Share API
      // Create a temporary download link
      const link = document.createElement("a");
      link.href = record.pdfUrl;
      link.download = `تقرير_${record.requestNumber}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error("Error sharing PDF:", error);
    // Fallback: open in new tab
    window.open(record.pdfUrl, "_blank");
  }
};

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
  },
  {
    title: "رابط الموقع",
    dataIndex: "siteLink",
    key: "siteLink",
    render: (text: string) => (
      <a
        href={text}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        {text}
      </a>
    ),
  },
  {
    title: "ملف PDF",
    dataIndex: "pdfUrl",
    key: "pdfUrl",
    render: (_: unknown, record: TableRecord) => {
      if (record.pdfUrl) {
        return (
          <Button
            type="primary"
            size="small"
            onClick={() => {
              window.open(record.pdfUrl, "_blank");
            }}
          >
            عرض PDF
          </Button>
        );
      } else {
        return <span className="text-gray-400 text-sm">غير متوفر</span>;
      }
    },
  },
  {
    title: "مشاركة",
    dataIndex: "share",
    key: "share",
    render: (_: unknown, record: TableRecord) => {
      if (record.pdfUrl) {
        return (
          <Button
            type="default"
            size="small"
            icon={<ShareAltOutlined />}
            onClick={() => handleSharePDF(record)}
            className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
          >
            مشاركة
          </Button>
        );
      } else {
        return <span className="text-gray-400 text-sm">غير متوفر</span>;
      }
    },
  },
];

export const DataTable: React.FC<DataTableProps> = ({ data, onDelete }) => {
  const [filters, setFilters] = useState({
    requestNumber: "",
  });

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    position: ["bottomCenter"],
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} من ${total} سجل`,
  });

  const filteredData = useMemo(() => {
    return data.filter((record) => {
      const matchesRequestNumber = record.requestNumber
        .toLowerCase()
        .includes(filters.requestNumber.toLowerCase());

      return matchesRequestNumber;
    });
  }, [data, filters]);

  const getStartingNumber = (index: number) => {
    return (pagination.current! - 1) * pagination.pageSize! + index + 1;
  };

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const columns = [
    {
      title: "#",
      dataIndex: "count",
      key: "count",
      width: 60,
      render: (_: unknown, __: TableRecord, index: number) => (
        <span className="text-sm text-gray-500 font-medium">
          {getStartingNumber(index)}
        </span>
      ),
    },
    ...TABLE_COLUMNS, // Include all columns from TABLE_COLUMNS
    {
      title: "الإجراءات",
      key: "actions",
      render: (_: unknown, record: TableRecord) => (
        <ActionButtons record={record} onDelete={onDelete} />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Record count info */}
      <div className="flex justify-between items-center">
        <Text className="text-gray-600">
          إجمالي السجلات: {filteredData.length}
        </Text>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Search
          placeholder="البحث في رقم الطلب"
          value={filters.requestNumber}
          onChange={(e) => handleFilterChange("requestNumber", e.target.value)}
          allowClear
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={pagination}
        onChange={(paginationConfig) => setPagination(paginationConfig)}
        rowKey="key"
        className="bg-white rounded-lg shadow"
      />
    </div>
  );
};
