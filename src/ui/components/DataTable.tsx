import React, { useState, useMemo } from "react";
import { Table, Input, Button, Typography } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import { TableRecord } from "src/types/form-data.type";
import { ActionButtons } from "./ActionButtons";

const { Search } = Input;
const { Text } = Typography;

interface DataTableProps {
  data: TableRecord[];
  onDelete: (key: string) => Promise<void>;
  onPreview?: (images: string[]) => void;
}

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
];

export const DataTable: React.FC<DataTableProps> = ({ data, onDelete }) => {
  const [filters, setFilters] = useState({
    requestNumber: "",
    neighborhoodName: "",
    streetName: "",
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
      const matchesNeighborhood = record.neighborhoodName
        .toLowerCase()
        .includes(filters.neighborhoodName.toLowerCase());
      const matchesStreet = record.streetName
        .toLowerCase()
        .includes(filters.streetName.toLowerCase());

      return matchesRequestNumber && matchesNeighborhood && matchesStreet;
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
        <Search
          placeholder="البحث في اسم الحي"
          value={filters.neighborhoodName}
          onChange={(e) =>
            handleFilterChange("neighborhoodName", e.target.value)
          }
          allowClear
        />
        <Search
          placeholder="البحث في اسم الشارع"
          value={filters.streetName}
          onChange={(e) => handleFilterChange("streetName", e.target.value)}
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
