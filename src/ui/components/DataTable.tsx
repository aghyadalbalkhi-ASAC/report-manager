import { Table, Button, Typography, Input, Select } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import { EyeOutlined, FilterOutlined, ClearOutlined } from "@ant-design/icons";
import { TableRecord } from "src/types/form-data.type";
import { ActionButtons } from "./ActionButtons";
import { useState, useMemo } from "react";

const { Text } = Typography;

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
  onDelete: (key: string) => Promise<void>;
}

export const DataTable = ({ data, onPreview, onDelete }: DataTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    requestNumber: "",
    neighborhood: "",
    street: "",
  });

  // Add onPreview function to each record for the images column
  const dataWithPreview = data.map((record) => ({
    ...record,
    onPreview,
  }));

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    return dataWithPreview.filter((record) => {
      const requestNumberLower = filters.requestNumber.toLowerCase();
      const neighborhoodLower = filters.neighborhood.toLowerCase();
      const streetLower = filters.street.toLowerCase();

      // Request number filter
      if (
        filters.requestNumber &&
        !record.requestNumber.toLowerCase().includes(requestNumberLower)
      ) {
        return false;
      }

      // Neighborhood filter
      if (
        filters.neighborhood &&
        !record.neighborhoodName.toLowerCase().includes(neighborhoodLower)
      ) {
        return false;
      }

      // Street filter
      if (
        filters.street &&
        !record.streetName.toLowerCase().includes(streetLower)
      ) {
        return false;
      }

      return true;
    });
  }, [dataWithPreview, filters]);

  // Calculate the starting number for the current page
  const getStartingNumber = (index: number) => {
    return (currentPage - 1) * pageSize + index + 1;
  };

  // Get unique values for select options
  const uniqueNeighborhoods = useMemo(() => {
    const neighborhoods = [
      ...new Set(data.map((record) => record.neighborhoodName)),
    ];
    return neighborhoods.sort();
  }, [data]);

  const uniqueStreets = useMemo(() => {
    const streets = [...new Set(data.map((record) => record.streetName))];
    return streets.sort();
  }, [data]);

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
    // Explicitly add requestNumber as the first data column
    {
      title: "رقم الطلب",
      dataIndex: "requestNumber",
      key: "requestNumber",
    },
    ...TABLE_COLUMNS.slice(2), // Skip the first (رقم الطلب) since it's added above
    {
      title: "الإجراءات",
      key: "actions",
      render: (_: unknown, record: TableRecord) => (
        <ActionButtons record={record} onDelete={onDelete} />
      ),
    },
  ];

  // Pagination configuration
  const pagination: TablePaginationConfig = {
    current: currentPage,
    pageSize: pageSize,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number, range: [number, number]) =>
      `عرض ${range[0]}-${range[1]} من ${total} سجل`,
    pageSizeOptions: ["10", "20", "50", "100"],
    size: "default",
    position: ["bottomCenter"],
    onChange: (page, size) => {
      setCurrentPage(page);
      setPageSize(size);
    },
    locale: {
      items_per_page: "سجل لكل صفحة",
      jump_to: "انتقل إلى",
      jump_to_confirm: "تأكيد",
      page: "صفحة",
      prev_page: "الصفحة السابقة",
      next_page: "الصفحة التالية",
      prev_5: "5 صفحات سابقة",
      next_5: "5 صفحات تالية",
      prev_3: "3 صفحات سابقة",
      next_3: "3 صفحات تالية",
    },
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setFilters({
      requestNumber: "",
      neighborhood: "",
      street: "",
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Record count info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <Text className="text-gray-600">
            إجمالي السجلات:{" "}
            <span className="font-semibold text-blue-600">{data.length}</span>{" "}
            سجل
            {filteredData.length !== data.length && (
              <span className="mr-2">
                | النتائج المفلترة:{" "}
                <span className="font-semibold text-green-600">
                  {filteredData.length}
                </span>{" "}
                سجل
              </span>
            )}
          </Text>
          <div className="flex items-center gap-2">
            {data.length > 0 && (
              <Text className="text-gray-500 text-sm">
                آخر تحديث: {new Date().toLocaleString("ar-SA")}
              </Text>
            )}
            {/* إعادة التعيين button removed */}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <FilterOutlined className="text-gray-500" />
          <Text className="font-medium text-gray-700">فلاتر البحث</Text>
          {hasActiveFilters && (
            <Button
              type="link"
              icon={<ClearOutlined />}
              onClick={clearFilters}
              size="small"
              className="text-red-500"
            >
              مسح الفلاتر
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="رقم الطلب"
            value={filters.requestNumber}
            onChange={(e) =>
              handleFilterChange("requestNumber", e.target.value)
            }
            allowClear
          />

          <Select
            placeholder="اختر الحي"
            value={filters.neighborhood || undefined}
            onChange={(value) =>
              handleFilterChange("neighborhood", value || "")
            }
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={uniqueNeighborhoods.map((name) => ({
              label: name,
              value: name,
            }))}
          />

          <Select
            placeholder="اختر الشارع"
            value={filters.street || undefined}
            onChange={(value) => handleFilterChange("street", value || "")}
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={uniqueStreets.map((name) => ({
              label: name,
              value: name,
            }))}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={pagination}
        className="rtl"
        rowClassName="hover:bg-gray-50"
        scroll={{ x: 1200 }} // Enable horizontal scroll for small screens
      />
    </div>
  );
};
