import { TableRecord } from "src/types/form-data.type";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "src/config/firebase";
import type { UploadFile } from "antd/es/upload/interface";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generateAndStorePDF = async (
  record: TableRecord,
  fileList: UploadFile[]
): Promise<string> => {
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

  // Convert images to base64 for embedding in PDF
  const imagePromises = fileList.map(async (file) => {
    if (!file.originFileObj) return null;

    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      reader.readAsDataURL(file.originFileObj!);
    });
  });

  const imageBase64s = await Promise.all(imagePromises);
  const validImages = imageBase64s.filter((img) => img !== null) as string[];

  console.log("🔄 Converting images to base64:", validImages.length, "images");

  // Create the PDF content
  container.innerHTML = `
    <div style="margin-bottom: 30px;">
      <h1 style="color: #1f2937; margin-bottom: 10px; font-size: 24px;">تقرير البيانات</h1>
      <p style="color: #6b7280; font-size: 14px;">تاريخ الإنشاء: ${record.createdDate}</p>
    </div>
    
    <div style="margin-bottom: 30px;">
      <h2 style="color: #374151; margin-bottom: 15px; font-size: 18px;">معلومات الطلب</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; direction: rtl;">
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; font-weight: bold; color: #374151; width: 150px; text-align: right;">رقم الطلب:</td>
          <td style="padding: 12px; color: #1f2937; text-align: right;">${record.requestNumber}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; font-weight: bold; color: #374151; text-align: right;">رابط الموقع:</td>
          <td style="padding: 12px; color: #1f2937; text-align: right;">
            <a href="${record.siteLink}" target="_blank" style="color: #3b82f6; text-decoration: underline;">${record.siteLink}</a>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; font-weight: bold; color: #374151; text-align: right;">اسم الحي:</td>
          <td style="padding: 12px; color: #1f2937; text-align: right;">${record.neighborhoodName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; font-weight: bold; color: #374151; text-align: right;">اسم الشارع:</td>
          <td style="padding: 12px; color: #1f2937; text-align: right;">${record.streetName}</td>
        </tr>
      </table>
    </div>
    
    ${
      validImages.length > 0
        ? `
        <div>
          <h2 style="color: #374151; margin-bottom: 15px; font-size: 18px;">الصور المرفقة</h2>
          <div style="display: flex; flex-direction: column; gap: 20px;">
            ${validImages
              .map(
                (image, index) => `
              <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; max-width: 100%;">
                <img src="${image}" alt="صورة ${index + 1}" style="width: auto; height: auto; max-width: 100%; display: block;" />
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

  try {
    // Add container to DOM temporarily
    document.body.appendChild(container);

    console.log("🔄 Converting HTML to PDF using html2canvas...");

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const margin = 20; // margin in mm
    const contentWidth = pageWidth - 2 * margin;

    let currentY = margin;

    // Create HTML content for the header and info
    const headerContainer = document.createElement("div");
    headerContainer.style.position = "absolute";
    headerContainer.style.left = "-9999px";
    headerContainer.style.top = "0";
    headerContainer.style.width = "800px";
    headerContainer.style.backgroundColor = "white";
    headerContainer.style.padding = "20px";
    headerContainer.style.fontFamily = "Arial, sans-serif";
    headerContainer.style.direction = "rtl";
    headerContainer.style.textAlign = "right";

    // Format date in English to avoid encoding issues
    const dateObj = new Date();
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    headerContainer.innerHTML = `
    <div style="margin-bottom: 30px;">
      <h1 style="color: #1f2937; margin-bottom: 10px; font-size: 24px;">تقرير البيانات</h1>
      <p style="color: #6b7280; font-size: 14px;">تاريخ الإنشاء: ${formattedDate}</p>
    </div>
    
    <div style="margin-bottom: 30px;">
      <h2 style="color: #374151; margin-bottom: 15px; font-size: 18px;">معلومات الطلب</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; direction: rtl;">
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; font-weight: bold; color: #374151; width: 150px; text-align: right;">رقم الطلب:</td>
          <td style="padding: 12px; color: #1f2937; text-align: right;">${record.requestNumber}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; font-weight: bold; color: #374151; text-align: right;">رابط الموقع:</td>
          <td style="padding: 12px; color: #1f2937; text-align: right;">
            <a href="${record.siteLink}" target="_blank" style="color: #3b82f6; text-decoration: underline;">${record.siteLink}</a>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; font-weight: bold; color: #374151; text-align: right;">اسم الحي:</td>
          <td style="padding: 12px; color: #1f2937; text-align: right;">${record.neighborhoodName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; font-weight: bold; color: #374151; text-align: right;">اسم الشارع:</td>
          <td style="padding: 12px; color: #1f2937; text-align: right;">${record.streetName}</td>
        </tr>
      </table>
    </div>
  `;

    document.body.appendChild(headerContainer);

    // Convert header to canvas
    const headerCanvas = await html2canvas(headerContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    });

    // Calculate header dimensions
    const headerImgWidth = contentWidth;
    const headerImgHeight =
      (headerCanvas.height * headerImgWidth) / headerCanvas.width;

    // Add header to PDF
    pdf.addImage(
      headerCanvas,
      "JPEG",
      margin,
      currentY,
      headerImgWidth,
      headerImgHeight
    );
    currentY += headerImgHeight + 20;

    // Remove header container
    document.body.removeChild(headerContainer);

    // Add images section
    if (validImages.length > 0) {
      // Check if we need a new page for images section
      if (currentY > pageHeight - margin - 30) {
        pdf.addPage();
        currentY = margin;
      }

      // Create images section container
      const imagesContainer = document.createElement("div");
      imagesContainer.style.position = "absolute";
      imagesContainer.style.left = "-9999px";
      imagesContainer.style.top = "0";
      imagesContainer.style.width = "800px";
      imagesContainer.style.backgroundColor = "white";
      imagesContainer.style.padding = "20px";
      imagesContainer.style.fontFamily = "Arial, sans-serif";
      imagesContainer.style.direction = "rtl";
      imagesContainer.style.textAlign = "right";

      imagesContainer.innerHTML = `
      <div>
        <h2 style="color: #374151; margin-bottom: 15px; font-size: 18px;">الصور المرفقة</h2>
        <div style="display: flex; flex-direction: column; gap: 20px;">
          ${validImages
            .map(
              (image, index) => `
              <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; max-width: 100%;">
                <img src="${image}" alt="صورة ${index + 1}" style="width: auto; height: auto; max-width: 100%; display: block;" />
                <div style="padding: 8px; background-color: #f9fafb; text-align: center; font-size: 12px; color: #6b7280;">
                  صورة ${index + 1}
                </div>
              </div>
            `
            )
            .join("")}
        </div>
      </div>
    `;

      document.body.appendChild(imagesContainer);

      // Convert images section to canvas
      const imagesCanvas = await html2canvas(imagesContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      // Calculate images section dimensions
      const imagesImgWidth = contentWidth;
      const imagesImgHeight =
        (imagesCanvas.height * imagesImgWidth) / imagesCanvas.width;

      // Check if we need a new page for images
      if (currentY + imagesImgHeight > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }

      // Add images section to PDF
      pdf.addImage(
        imagesCanvas,
        "JPEG",
        margin,
        currentY,
        imagesImgWidth,
        imagesImgHeight
      );

      // Remove images container
      document.body.removeChild(imagesContainer);
    } else {
      // Check if we need a new page for "no images" message
      if (currentY > pageHeight - margin - 20) {
        pdf.addPage();
        currentY = margin;
      }

      // Create no images message container
      const noImagesContainer = document.createElement("div");
      noImagesContainer.style.position = "absolute";
      noImagesContainer.style.left = "-9999px";
      noImagesContainer.style.top = "0";
      noImagesContainer.style.width = "800px";
      noImagesContainer.style.backgroundColor = "white";
      noImagesContainer.style.padding = "20px";
      noImagesContainer.style.fontFamily = "Arial, sans-serif";
      noImagesContainer.style.direction = "rtl";
      noImagesContainer.style.textAlign = "right";

      noImagesContainer.innerHTML = `
      <p style="color: #6b7280; font-style: italic;">لا توجد صور مرفقة</p>
    `;

      document.body.appendChild(noImagesContainer);

      // Convert no images message to canvas
      const noImagesCanvas = await html2canvas(noImagesContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      // Calculate no images message dimensions
      const noImagesImgWidth = contentWidth;
      const noImagesImgHeight =
        (noImagesCanvas.height * noImagesImgWidth) / noImagesCanvas.width;

      // Add no images message to PDF
      pdf.addImage(
        noImagesCanvas,
        "JPEG",
        margin,
        currentY,
        noImagesImgWidth,
        noImagesImgHeight
      );

      // Remove no images container
      document.body.removeChild(noImagesContainer);
    }

    // Convert PDF to blob
    const pdfBlob = pdf.output("blob");
    console.log("✅ PDF generated successfully");

    // Upload to Firebase Storage
    const timestamp = Date.now();
    const pdfFileName = `reports/${record.requestNumber}_${timestamp}.pdf`;
    const storageRef = ref(storage, pdfFileName);

    console.log("🔄 Uploading PDF to Firebase Storage:", pdfFileName);
    await uploadBytes(storageRef, pdfBlob);
    console.log("✅ PDF uploaded successfully");

    const pdfUrl = await getDownloadURL(storageRef);
    console.log("✅ PDF URL generated:", pdfUrl);

    // Remove container from DOM
    document.body.removeChild(container);

    return pdfUrl;
  } catch (error: unknown) {
    console.error("❌ Error generating and storing PDF:", error);
    // Remove container from DOM if it exists
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    throw new Error("فشل في إنشاء وحفظ ملف PDF");
  }
};

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
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; direction: rtl;">
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; font-weight: bold; color: #374151; width: 150px; text-align: right;">رقم الطلب:</td>
          <td style="padding: 12px; color: #1f2937; text-align: right;">${record.requestNumber}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; font-weight: bold; color: #374151; text-align: right;">رابط الموقع:</td>
          <td style="padding: 12px; color: #1f2937; text-align: right;">
            <a href="${record.siteLink}" target="_blank" style="color: #3b82f6; text-decoration: underline;">${record.siteLink}</a>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; font-weight: bold; color: #374151; text-align: right;">اسم الحي:</td>
          <td style="padding: 12px; color: #1f2937; text-align: right;">${record.neighborhoodName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; font-weight: bold; color: #374151; text-align: right;">اسم الشارع:</td>
          <td style="padding: 12px; color: #1f2937; text-align: right;">${record.streetName}</td>
        </tr>
      </table>
    </div>
    
    ${
      (record.images?.length || 0) > 0
        ? `
        <div>
          <h2 style="color: #374151; margin-bottom: 15px; font-size: 18px;">الصور المرفقة</h2>
          <div style="display: flex; flex-direction: column; gap: 20px;">
            ${record
              .images!.map(
                (image, index) => `
              <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; max-width: 100%;">
                <img src="${image}" alt="صورة ${index + 1}" style="width: auto; height: auto; max-width: 100%; display: block;" />
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
        <html dir="rtl">
          <head>
            <title>تقرير ${record.requestNumber}</title>
            <style>
              body { 
                margin: 0; 
                direction: rtl; 
                text-align: right; 
                font-family: Arial, sans-serif;
              }
              .no-print { display: none; }
              table { direction: rtl; }
              td { text-align: right; }
              a { color: #3b82f6; text-decoration: underline; }
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
