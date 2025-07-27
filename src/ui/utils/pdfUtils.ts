import { TableRecord } from "src/types/form-data.type";

export const exportToPDF = async (record: TableRecord) => {
  // Create a temporary container for the PDF content
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "800px";
  container.style.backgroundColor = "white";
  container.style.padding = "20px";
  container.style.fontFamily = "Arial, sans-serif";
  container.style.direction = "rtl";
  container.style.textAlign = "right";

  // Create the PDF content
  container.innerHTML = `
    <div style="margin-bottom: 30px;">
      <h1 style="color: #1f2937; margin-bottom: 10px; font-size: 24px;">تقرير البيانات</h1>
      <p style="color: #6b7280; font-size: 14px;">تاريخ الإنشاء: ${record.createdDate}</p>
    </div>
    
    <div style="margin-bottom: 30px;">
      <h2 style="color: #374151; margin-bottom: 15px; font-size: 18px;">معلومات الطلب</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; font-weight: bold; color: #374151; width: 150px;">رقم الطلب:</td>
          <td style="padding: 12px; color: #1f2937;">${record.requestNumber}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; font-weight: bold; color: #374151;">رابط الموقع:</td>
          <td style="padding: 12px; color: #1f2937;">${record.siteLink}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; font-weight: bold; color: #374151;">اسم الحي:</td>
          <td style="padding: 12px; color: #1f2937;">${record.neighborhoodName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; font-weight: bold; color: #374151;">اسم الشارع:</td>
          <td style="padding: 12px; color: #1f2937;">${record.streetName}</td>
        </tr>
        <tr>
          <td style="padding: 12px; font-weight: bold; color: #374151;">عدد الصور:</td>
          <td style="padding: 12px; color: #1f2937;">${record.images.length} صورة</td>
        </tr>
      </table>
    </div>
    
    ${
      record.images.length > 0
        ? `
      <div>
        <h2 style="color: #374151; margin-bottom: 15px; font-size: 18px;">الصور المرفقة</h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
          ${record.images
            .map(
              (image, index) => `
            <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
              <img src="${image}" alt="صورة ${index + 1}" style="width: 100%; height: 200px; object-fit: cover;" />
              <div style="padding: 8px; background-color: #f9fafb; text-align: center; font-size: 12px; color: #6b7280;">
                صورة ${index + 1}
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `
        : '<p style="color: #6b7280; font-style: italic;">لا توجد صور مرفقة</p>'
    }
  `;

  // Add container to DOM
  document.body.appendChild(container);

  try {
    // Use browser's print functionality
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>تقرير ${record.requestNumber}</title>
            <style>
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            ${container.innerHTML}
            <div class="no-print" style="text-align: center; margin-top: 20px;">
              <button onclick="window.print()">طباعة / حفظ كـ PDF</button>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }

    // Remove container from DOM
    document.body.removeChild(container);
  } catch (error) {
    console.error("Error generating PDF:", error);
    document.body.removeChild(container);
    throw new Error("فشل في إنشاء ملف PDF");
  }
};
