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

// Enhanced Share PDF function with better mobile support and debugging
const handleSharePDF = async (record: TableRecord) => {
  if (!record.pdfUrl) {
    message.error("لا يوجد رابط PDF متاح");
    return;
  }

  try {
    // First, let's check what's available
    console.log("🔍 Checking Web Share API support:");
    console.log("- navigator.share available:", !!navigator.share);
    console.log("- navigator.canShare available:", !!navigator.canShare);
    console.log("- User agent:", navigator.userAgent);

    message.loading("جاري تحضير الملف للمشاركة...", 0);

    // Download the file first to get the actual content
    console.log("🔄 Downloading PDF file for sharing...");
    const response = await fetch(record.pdfUrl, {
      method: "GET",
      headers: {
        Accept: "application/pdf",
      },
      mode: "cors", // Ensure CORS is handled
    });

    if (!response.ok) {
      throw new Error(
        `Failed to download PDF: ${response.status} ${response.statusText}`
      );
    }

    const blob = await response.blob();
    console.log("📄 Original blob type:", blob.type, "Size:", blob.size);

    // Create proper PDF blob and file
    const fileName = `تقرير_${record.requestNumber}.pdf`;
    const pdfBlob = new Blob([blob], { type: "application/pdf" });
    const file = new File([pdfBlob], fileName, {
      type: "application/pdf",
      lastModified: Date.now(),
    });

    console.log("✅ File created:", {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
    });

    message.destroy(); // Remove loading message

    // Check Web Share API availability and file sharing support
    if (navigator.share) {
      console.log("📱 Web Share API is available");

      // Test if we can share files
      let canShareFiles = false;
      if (navigator.canShare) {
        try {
          canShareFiles = navigator.canShare({ files: [file] });
          console.log("📁 Can share files:", canShareFiles);
        } catch (canShareError) {
          console.log("❌ Error checking canShare:", canShareError);
        }
      } else {
        console.log("⚠️ navigator.canShare not available, trying anyway...");
        // On some browsers, canShare might not exist but file sharing still works
        canShareFiles = true;
      }

      if (canShareFiles) {
        try {
          console.log("📱 Attempting to share file...");
          console.log("Share data:", {
            title: `تقرير ${record.requestNumber}`,
            text: `تقرير البيانات - رقم الطلب: ${record.requestNumber}`,
            files: [file],
          });

          await navigator.share({
            title: `تقرير ${record.requestNumber}`,
            text: `تقرير البيانات - رقم الطلب: ${record.requestNumber}`,
            files: [file],
          });

          console.log("✅ File shared successfully via Web Share API");
          message.success("تم مشاركة الملف بنجاح");
          return;
        } catch (shareError: unknown) {
          const error = shareError as Error;
          console.log("❌ File sharing error:", error);
          console.log("Error name:", error.name);
          console.log("Error message:", error.message);

          // If user cancelled, don't continue with fallbacks
          if (error.name === "AbortError") {
            console.log("🚫 User cancelled sharing");
            return;
          }

          // Log the specific error for debugging
          if (error.name === "NotAllowedError") {
            console.log("🔒 Permission denied for file sharing");
          } else if (error.name === "DataError") {
            console.log("📄 Invalid data for sharing");
          }
        }
      } else {
        console.log("❌ File sharing not supported, skipping to fallbacks");
      }
    } else {
      console.log("❌ Web Share API not available");
    }

    // Fallback strategies for mobile devices
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      console.log(
        "📱 Mobile device detected, trying mobile-specific fallbacks"
      );

      // Try to create a blob URL and use it with the share API (URL sharing)
      if (navigator.share) {
        try {
          const blobUrl = URL.createObjectURL(pdfBlob);
          console.log("🔗 Created blob URL for sharing:", blobUrl);

          await navigator.share({
            title: `تقرير ${record.requestNumber}`,
            text: `تقرير البيانات - رقم الطلب: ${record.requestNumber}\n\nملف PDF مرفق`,
            url: blobUrl,
          });

          console.log("✅ Blob URL shared successfully");
          message.success("تم مشاركة الملف بنجاح");

          // Clean up blob URL after a delay
          setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
          return;
        } catch (urlShareError: unknown) {
          const error = urlShareError as Error;
          console.log("❌ Blob URL sharing failed:", error);
          if (error.name === "AbortError") {
            return;
          }
        }
      }

      // Mobile fallback: trigger download and show instructions
      downloadFile(pdfBlob, fileName);
      message.success("تم تحميل الملف. يمكنك الآن مشاركته من مجلد التحميلات");
    } else {
      // Desktop fallback: download the file
      console.log("💻 Desktop device, downloading file");
      downloadFile(pdfBlob, fileName);
      message.success("تم تحميل الملف بنجاح");
    }
  } catch (error: unknown) {
    const err = error as Error;
    console.error("❌ Complete error in share process:", err);
    console.error("Error stack:", err.stack);
    message.destroy();
    message.error("حدث خطأ أثناء تحضير الملف للمشاركة");

    // Last resort: open in new tab
    console.log("🆘 Last resort: opening in new tab");
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

// Alternative sharing approach for problematic cases
const handleAlternativeShare = async (record: TableRecord) => {
  if (!record.pdfUrl) {
    message.error("لا يوجد رابط PDF متاح");
    return;
  }

  try {
    message.loading("جاري تحضير الملف...", 0);

    // For Firebase URLs, we might need to handle them differently
    let fetchUrl = record.pdfUrl;

    // If it's a Firebase URL, ensure we have the right parameters
    if (
      record.pdfUrl.includes("firebase") ||
      record.pdfUrl.includes("googleapis")
    ) {
      // Add token if needed or ensure proper CORS headers
      const url = new URL(record.pdfUrl);
      url.searchParams.set("alt", "media"); // This helps with Firebase Storage
      fetchUrl = url.toString();
      console.log("🔥 Using Firebase-optimized URL:", fetchUrl);
    }

    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        Accept: "application/pdf, */*",
        "Cache-Control": "no-cache",
      },
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: "application/pdf" });
    const fileName = `تقرير_${record.requestNumber}.pdf`;

    console.log("📁 File prepared:", {
      size: blob.size,
      type: blob.type,
      name: fileName,
    });

    message.destroy();

    // Create File object for sharing
    const file = new File([blob], fileName, {
      type: "application/pdf",
      lastModified: Date.now(),
    });

    // Try direct sharing first
    if (navigator.share) {
      try {
        // Test with minimal data first
        const shareData = {
          title: `تقرير ${record.requestNumber}`,
          files: [file],
        };

        // Check if this specific data can be shared
        if (navigator.canShare && !navigator.canShare(shareData)) {
          throw new Error("Cannot share this data");
        }

        console.log("📤 Attempting to share with data:", shareData);
        await navigator.share(shareData);

        console.log("✅ Alternative sharing successful");
        message.success("تم مشاركة الملف بنجاح");
        return;
      } catch (shareError: unknown) {
        const error = shareError as Error;
        console.log("❌ Alternative sharing failed:", error);

        if (error.name === "AbortError") {
          return; // User cancelled
        }
      }
    }

    // Fallback: Create a temporary blob URL and try sharing that
    const blobUrl = URL.createObjectURL(blob);

    if (navigator.share) {
      try {
        await navigator.share({
          title: `تقرير ${record.requestNumber}`,
          text: `ملف PDF - رقم الطلب: ${record.requestNumber}`,
          url: blobUrl,
        });

        message.success("تم مشاركة الملف");
        setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
        return;
      } catch (blobShareError: unknown) {
        const error = blobShareError as Error;
        console.log("❌ Blob URL sharing failed:", error);
        if (error.name !== "AbortError") {
          URL.revokeObjectURL(blobUrl);
        }
      }
    }

    // Final fallback: download
    downloadFile(blob, fileName);
    message.success("تم تحميل الملف - يمكنك مشاركته من المجلد");
  } catch (error: unknown) {
    const err = error as Error;
    console.error("❌ Alternative sharing error:", err);
    message.destroy();
    message.error("فشل في تحضير الملف: " + err.message);
  }
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
            onClick={() => {
              // Try the enhanced method first, then fallback to alternative
              handleSharePDF(record).catch(() =>
                handleAlternativeShare(record)
              );
            }}
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
