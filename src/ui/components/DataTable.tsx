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

    // Check if this is a Firebase Storage URL
    const isFirebaseUrl =
      record.pdfUrl.includes("firebase") ||
      record.pdfUrl.includes("googleapis");

    let fetchUrl = record.pdfUrl;

    // Handle Firebase Storage URLs differently
    if (isFirebaseUrl) {
      console.log("🔥 Firebase URL detected, using optimized approach");

      // For Firebase URLs, we need to handle CORS properly
      // Try to get the file using Firebase SDK instead of fetch
      try {
        // Import Firebase Storage functions dynamically to avoid circular dependencies
        const { ref, getDownloadURL } = await import("firebase/storage");
        const { storage } = await import("src/config/firebase");

        // Extract the file path from the URL
        const urlObj = new URL(record.pdfUrl);
        const pathSegments = urlObj.pathname.split("/");
        const filePath = pathSegments
          .slice(pathSegments.indexOf("o") + 1)
          .join("/");

        const decodedPath = decodeURIComponent(filePath);
        const storageRef = ref(storage, decodedPath);

        console.log("🔄 Getting fresh download URL from Firebase...");
        const freshUrl = await getDownloadURL(storageRef);

        // Use the fresh URL for fetching
        fetchUrl = freshUrl;
        console.log("✅ Fresh Firebase URL obtained:", freshUrl);
      } catch (firebaseError) {
        console.log(
          "⚠️ Could not get fresh Firebase URL, using original:",
          firebaseError
        );
        // Continue with original URL
      }
    }

    // Download the file first to get the actual content
    console.log("🔄 Downloading PDF file for sharing...");
    const blob = await downloadFileWithCORS(fetchUrl);
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

    // Check if it's a CORS error or network error
    if (
      err.message.includes("CORS") ||
      err.message.includes("Failed to fetch") ||
      err.message.includes("NetworkError")
    ) {
      console.log(
        "🚫 CORS/Network error detected, trying alternative approach"
      );

      // Try alternative sharing method
      try {
        await handleAlternativeShare(record);
        return;
      } catch (altError) {
        console.error("❌ Alternative sharing also failed:", altError);
        message.error(
          "فشل في تحميل الملف. يرجى المحاولة مرة أخرى أو فتح الملف في نافذة جديدة"
        );
      }
    }

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

// Helper function to download file with CORS support
const downloadFileWithCORS = async (url: string): Promise<Blob> => {
  // Check if this is a Firebase Storage URL
  const isFirebaseUrl = url.includes("firebase") || url.includes("googleapis");

  if (isFirebaseUrl) {
    try {
      // Use Firebase SDK to get the file directly as blob
      const { ref, getDownloadURL, getBytes } = await import(
        "firebase/storage"
      );
      const { storage } = await import("src/config/firebase");

      // Extract the file path from the URL
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split("/");
      const filePath = pathSegments
        .slice(pathSegments.indexOf("o") + 1)
        .join("/");

      const decodedPath = decodeURIComponent(filePath);
      const storageRef = ref(storage, decodedPath);

      console.log("🔄 Getting file directly from Firebase Storage...");

      // Try getBytes first (completely bypasses CORS)
      try {
        console.log("🔄 Attempting to get file bytes directly...");
        const bytes = await getBytes(storageRef);
        const blob = new Blob([bytes], { type: "application/pdf" });
        console.log("✅ File downloaded successfully via getBytes");
        return blob;
      } catch (bytesError) {
        console.log(
          "⚠️ getBytes failed, trying getDownloadURL + XHR:",
          bytesError
        );

        // Fallback to getDownloadURL + XHR
        const downloadURL = await getDownloadURL(storageRef);

        // Use XMLHttpRequest instead of fetch to avoid CORS issues
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("GET", downloadURL, true);
          xhr.responseType = "blob";

          xhr.onload = function () {
            if (xhr.status === 200) {
              console.log("✅ File downloaded successfully via XHR");
              resolve(xhr.response);
            } else {
              reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
            }
          };

          xhr.onerror = function () {
            reject(new Error("Network error occurred"));
          };

          xhr.send();
        });
      }
    } catch (firebaseError) {
      console.log(
        "⚠️ Firebase SDK approach failed, trying alternative methods:",
        firebaseError
      );

      // Try with modified URL parameters
      try {
        const urlObj = new URL(url);
        urlObj.searchParams.set("alt", "media");
        const modifiedUrl = urlObj.toString();
        console.log("🔄 Trying with alt=media parameter via XHR:", modifiedUrl);

        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("GET", modifiedUrl, true);
          xhr.responseType = "blob";

          xhr.onload = function () {
            if (xhr.status === 200) {
              console.log(
                "✅ File downloaded successfully via XHR with alt=media"
              );
              resolve(xhr.response);
            } else {
              reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
            }
          };

          xhr.onerror = function () {
            reject(new Error("Network error occurred with alt=media"));
          };

          xhr.send();
        });
      } catch (modifiedError) {
        console.log(
          "⚠️ Modified URL also failed, trying original URL via XHR:",
          modifiedError
        );

        // Try with original URL using XHR
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("GET", url, true);
          xhr.responseType = "blob";

          xhr.onload = function () {
            if (xhr.status === 200) {
              console.log(
                "✅ File downloaded successfully via XHR with original URL"
              );
              resolve(xhr.response);
            } else {
              reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
            }
          };

          xhr.onerror = function () {
            reject(new Error("Network error occurred with original URL"));
          };

          xhr.send();
        });
      }
    }
  }

  // For non-Firebase URLs, use XHR as well for consistency
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";

    xhr.onload = function () {
      if (xhr.status === 200) {
        console.log("✅ File downloaded successfully via XHR");
        resolve(xhr.response);
      } else {
        reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
      }
    };

    xhr.onerror = function () {
      reject(new Error("Network error occurred"));
    };

    xhr.send();
  });
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

    // Use the improved downloadFileWithCORS function which handles Firebase URLs properly
    const blob = await downloadFileWithCORS(record.pdfUrl);
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
    width: 120,
    fixed: "left" as const,
    ellipsis: true,
  },
  {
    title: "تاريخ الإنشاء",
    dataIndex: "createdDate",
    key: "createdDate",
    width: 140,
    ellipsis: true,
  },
  {
    title: "رابط الموقع",
    dataIndex: "siteLink",
    key: "siteLink",
    width: 200,
    ellipsis: true,
    render: (text: string) => (
      <a
        href={text}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline text-xs"
      >
        {text.length > 30 ? `${text.substring(0, 30)}...` : text}
      </a>
    ),
  },
  {
    title: "ملف PDF",
    dataIndex: "pdfUrl",
    key: "pdfUrl",
    width: 100,
    ellipsis: true,
    render: (_: unknown, record: TableRecord) => {
      if (record.pdfUrl) {
        return (
          <Button
            type="primary"
            size="small"
            onClick={() => {
              window.open(record.pdfUrl, "_blank");
            }}
            className="text-xs px-2"
          >
            عرض PDF
          </Button>
        );
      } else {
        return <span className="text-gray-400 text-xs">غير متوفر</span>;
      }
    },
  },
  {
    title: "مشاركة",
    dataIndex: "share",
    key: "share",
    width: 100,
    ellipsis: true,
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
            className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 text-xs px-2"
            title={isMobile ? "مشاركة الملف" : "تحميل الملف"}
          >
            {isMobile ? "مشاركة" : "تحميل"}
          </Button>
        );
      } else {
        return <span className="text-gray-400 text-xs">غير متوفر</span>;
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
    size: "small",
    responsive: true,
    showLessItems: true,
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
      fixed: "left" as const,
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
      width: 100,
      fixed: "right" as const,
      ellipsis: true,
      render: (_: unknown, record: TableRecord) => (
        <ActionButtons record={record} onDelete={onDelete} />
      ),
    },
  ];

  return (
    <div className="space-y-4 w-full overflow-hidden">
      {/* Record count info */}
      <div className="flex justify-between items-center px-2">
        <Text className="text-gray-600 text-sm">
          إجمالي السجلات: {filteredData.length}
        </Text>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 px-2">
        <Search
          placeholder="البحث في رقم الطلب"
          value={filters.requestNumber}
          onChange={(e) => handleFilterChange("requestNumber", e.target.value)}
          allowClear
          size="small"
        />
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={pagination}
          onChange={(paginationConfig) => setPagination(paginationConfig)}
          rowKey="key"
          className="bg-white rounded-lg shadow min-w-full"
          scroll={{ x: "max-content" }}
          size="small"
          tableLayout="auto"
        />
      </div>
    </div>
  );
};
