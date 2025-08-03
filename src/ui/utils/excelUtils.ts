import { TableRecord } from "src/types/form-data.type";
import * as XLSX from "xlsx";

// Export to Excel using xlsx library
export const exportToExcel = (data: TableRecord[]) => {
  try {
    console.log("🔄 Starting Excel export using xlsx library...");

    // Find the maximum number of images across all records
    const maxImages = Math.max(
      ...data.map((record) => record.images?.length || 0),
      0
    );

    // Prepare data for Excel
    const excelData = data.map((record) => {
      const baseData = {
        "رقم الطلب": record.requestNumber,
        "تاريخ الإنشاء": record.createdDate,
        "رابط الموقع": record.siteLink,
        "ملف PDF": record.pdfUrl || "غير متوفر",
      };

      // Add image columns
      const imageColumns: Record<string, string> = {};
      for (let i = 0; i < maxImages; i++) {
        imageColumns[`صورة ${i + 1}`] = record.images?.[i] || "";
      }

      return { ...baseData, ...imageColumns };
    });

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Find image column indices (they come after the base columns)
    const baseColumns = 4; // رقم الطلب, تاريخ الإنشاء, رابط الموقع, ملف PDF
    const imageColumnStart = baseColumns;

    // Add hyperlinks for each image column
    for (
      let col = imageColumnStart;
      col < imageColumnStart + maxImages;
      col++
    ) {
      const colLetter = XLSX.utils.encode_col(col);

      // Process each row in this image column
      for (let row = 1; row <= data.length; row++) {
        const cellAddress = `${colLetter}${row + 1}`; // +1 because row 1 is header
        const imageIndex = col - imageColumnStart;
        const record = data[row - 1];

        if (record && record.images && record.images[imageIndex]) {
          // Add hyperlink to the cell
          if (!worksheet[cellAddress]) {
            worksheet[cellAddress] = { v: record.images[imageIndex] };
          }

          // Add hyperlink formatting
          worksheet[cellAddress].l = {
            Target: record.images[imageIndex],
            Tooltip: "انقر لفتح الصورة",
          };
        }
      }
    }

    // Add hyperlinks for PDF column (column D, index 3)
    const pdfColLetter = XLSX.utils.encode_col(3); // Column D
    for (let row = 1; row <= data.length; row++) {
      const cellAddress = `${pdfColLetter}${row + 1}`; // +1 because row 1 is header
      const record = data[row - 1];

      if (record && record.pdfUrl) {
        // Add hyperlink formatting for PDF
        if (!worksheet[cellAddress]) {
          worksheet[cellAddress] = { v: record.pdfUrl };
        }

        // Add hyperlink formatting
        worksheet[cellAddress].l = {
          Target: record.pdfUrl,
          Tooltip: "انقر لفتح ملف PDF",
        };
      }
    }

    // Set column widths
    const baseColumnWidths = [
      { wch: 15 }, // رقم الطلب
      { wch: 20 }, // تاريخ الإنشاء
      { wch: 40 }, // رابط الموقع
      { wch: 50 }, // ملف PDF
    ];

    // Add image column widths
    const imageColumnWidths = Array(maxImages).fill({ wch: 50 }); // صورة 1, صورة 2, etc.

    worksheet["!cols"] = [...baseColumnWidths, ...imageColumnWidths];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "تقرير البيانات");

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      bookSST: false,
      compression: true,
    });

    // Create and download file
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `تقرير_البيانات_${new Date().toISOString().split("T")[0]}.xlsx`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("✅ Excel export completed successfully");
    return true;
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "خطأ غير معروف";
    console.error("❌ Error exporting to Excel:", error);
    throw new Error(`فشل في تصدير البيانات: ${errMsg}`);
  }
};

// Alternative Excel-like format using HTML table (fallback)
export const exportToExcelHTML = (data: TableRecord[]) => {
  try {
    console.log("🔄 Starting Excel HTML export...");

    // Find the maximum number of images across all records
    const maxImages = Math.max(
      ...data.map((record) => record.images?.length || 0),
      0
    );

    // Create HTML table
    const tableHTML = `
      <html dir="rtl">
        <head>
          <meta charset="utf-8">
          <title>تقرير البيانات</title>
          <style>
            body { font-family: Arial, sans-serif; direction: rtl; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .header { text-align: center; margin-bottom: 20px; }
            a { color: #0066cc; text-decoration: underline; }
            a:hover { color: #003366; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>تقرير البيانات</h1>
            <p>تاريخ التصدير: ${new Date().toLocaleString("ar-SA")}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>تاريخ الإنشاء</th>
                <th>رابط الموقع</th>
                <th>ملف PDF</th>
                ${Array.from({ length: maxImages }, (_, i) => `<th>صورة ${i + 1}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (record) => `
                <tr>
                                 <td>${record.requestNumber}</td>
               <td>${record.createdDate}</td>
               <td><a href="${record.siteLink}" target="_blank">${record.siteLink}</a></td>
               <td>${record.pdfUrl ? `<a href="${record.pdfUrl}" target="_blank">فتح PDF</a>` : "غير متوفر"}</td>
                                    ${Array.from(
                                      { length: maxImages },
                                      (_, i) =>
                                        record.images?.[i]
                                          ? `<td><a href="${record.images?.[i]}" target="_blank">${record.images?.[i]}</a></td>`
                                          : `<td></td>`
                                    ).join("")}
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Create and download file
    const blob = new Blob([tableHTML], {
      type: "application/vnd.ms-excel",
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `تقرير_البيانات_${new Date().toISOString().split("T")[0]}.xls`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("✅ Excel HTML export completed successfully");
    return true;
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "خطأ غير معروف";
    console.error("❌ Error exporting to Excel HTML:", error);
    throw new Error(`فشل في تصدير البيانات: ${errMsg}`);
  }
};
