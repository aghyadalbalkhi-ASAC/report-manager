import React, { useState, useMemo } from "react";
import { Table, Input, Button, Typography, message } from "antd";
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

// Enhanced Share PDF function with better mobile support
const handleSharePDF = async (record: TableRecord) => {
  if (!record.pdfUrl) {
    message.error("لا يوجد رابط PDF متاح");
    return;
  }

  try {
    message.loading("جاري تحضير الملف للمشاركة...", 0);

    // Download the file first to get the actual content
    console.log("🔄 Downloading PDF file for sharing...");
    const response = await fetch(record.pdfUrl, {
      method: "GET",
      headers: {
        Accept: "application/pdf",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.status}`);
    }

    const blob = await response.blob();
    const fileName = `تقرير_${record.requestNumber}.pdf`;

    // Ensure the blob has the correct MIME type
    const pdfBlob = new Blob([blob], { type: "application/pdf" });
    const file = new File([pdfBlob], fileName, {
      type: "application/pdf",
      lastModified: Date.now(),
    });

    console.log(
      "✅ PDF file prepared:",
      fileName,
      "Size:",
      pdfBlob.size,
      "bytes"
    );
    message.destroy(); // Remove loading message

    // Check if Web Share API is available and supports files
    if (navigator.share) {
      // First check if we can share files
      const canShareFiles =
        navigator.canShare && navigator.canShare({ files: [file] });

      if (canShareFiles) {
        try {
          console.log("📱 Sharing file via native Web Share API...");
          await navigator.share({
            title: `تقرير ${record.requestNumber}`,
            text: `تقرير البيانات - رقم الطلب: ${record.requestNumber}`,
            files: [file],
          });
          console.log("✅ File shared successfully");
          message.success("تم مشاركة الملف بنجاح");
          return;
        } catch (shareError: unknown) {
          console.log("❌ File sharing failed:", shareError);
          // If user cancelled, don't show error
          if (
            shareError &&
            typeof shareError === "object" &&
            "name" in shareError &&
            shareError.name === "AbortError"
          ) {
            return;
          }
        }
      }

      // Fallback to URL sharing if file sharing not supported
      try {
        console.log("🔗 Falling back to URL sharing...");
        await navigator.share({
          title: `تقرير ${record.requestNumber}`,
          text: `تقرير البيانات - رقم الطلب: ${record.requestNumber}`,
          url: record.pdfUrl,
        });
        console.log("✅ URL shared successfully");
        message.success("تم مشاركة الرابط بنجاح");
        return;
      } catch (urlShareError: unknown) {
        console.log("❌ URL sharing failed:", urlShareError);
        if (urlShareError.name === "AbortError") {
          return;
        }
      }
    }

    // Final fallback: download the file
    console.log("💻 Using download fallback...");
    downloadFile(pdfBlob, fileName);
    message.success("تم تحميل الملف بنجاح");
  } catch (error) {
    console.error("❌ Error in share process:", error);
    message.destroy();
    message.error("حدث خطأ أثناء مشاركة الملف");

    // Last resort: open in new tab
    try {
      window.open(record.pdfUrl, "_blank");
    } catch (openError) {
      console.error("❌ Failed to open PDF:", openError);
    }
  }
};

// Helper function to download file
const downloadFile = (blob: Blob, fileName: string) => {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = fileName;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the blob URL after a short delay
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
};

// Check if device is mobile
const isMobileDevice = () => {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 2)
  );
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
        const isMobile = isMobileDevice();
        return (
          <Button
            type="default"
            size="small"
            icon={<ShareAltOutlined />}
            onClick={() => handleSharePDF(record)}
            className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            title={isMobile ? "مشاركة الملف" : "تحميل الملف"}
          >
            {isMobile ? "مشاركة" : "تحميل"}
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
    ...TABLE_COLUMNS,
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
