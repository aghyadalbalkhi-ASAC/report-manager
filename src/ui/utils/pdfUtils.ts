import { TableRecord } from "src/types/form-data.type";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "src/config/firebase";
import type { UploadFile } from "antd/es/upload/interface";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Helper function to create Arabic text container
const createArabicTextContainer = (
  text: string,
  fontSize: string = "16px",
  fontWeight: string = "normal",
  color: string = "#000000"
) => {
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "800px";
  container.style.backgroundColor = "white";
  container.style.padding = "20px";
  container.style.fontFamily = "Noto Sans Arabic, Arial, sans-serif";
  container.style.direction = "rtl";
  container.style.textAlign = "right";
  container.style.fontSize = fontSize;
  container.style.fontWeight = fontWeight;
  container.style.color = color;
  container.style.lineHeight = "1.5";
  container.innerHTML = text;
  return container;
};

// Helper function to render Arabic text as image
const renderArabicTextAsImage = async (
  text: string,
  fontSize: string = "16px",
  fontWeight: string = "normal",
  color: string = "#000000"
) => {
  const container = createArabicTextContainer(
    text,
    fontSize,
    fontWeight,
    color
  );
  document.body.appendChild(container);

  const canvas = await html2canvas(container, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  document.body.removeChild(container);
  return canvas;
};

export const generateAndStorePDF = async (
  record: TableRecord,
  fileList: UploadFile[]
): Promise<string> => {
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

  try {
    console.log("🔄 Generating PDF with enhanced Arabic support...");

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210; // A4 width in mm
    const margin = 20; // margin in mm
    const contentWidth = pageWidth - 2 * margin;

    let currentY = margin;

    // Render title as image for perfect Arabic support
    const titleCanvas = await renderArabicTextAsImage(
      "تقرير البيانات",
      "24px",
      "bold",
      "#1f2937"
    );
    const titleWidth = contentWidth;
    const titleHeight = (titleCanvas.height * titleWidth) / titleCanvas.width;
    pdf.addImage(
      titleCanvas,
      "JPEG",
      margin,
      currentY,
      titleWidth,
      titleHeight
    );
    currentY += titleHeight + 10;

    // Add creation date
    const dateObj = new Date();
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const dateCanvas = await renderArabicTextAsImage(
      `تاريخ الإنشاء: ${formattedDate}`,
      "14px",
      "normal",
      "#6b7280"
    );
    const dateWidth = contentWidth;
    const dateHeight = (dateCanvas.height * dateWidth) / dateCanvas.width;
    pdf.addImage(dateCanvas, "JPEG", margin, currentY, dateWidth, dateHeight);
    currentY += dateHeight + 15;

    // Add section title
    const sectionCanvas = await renderArabicTextAsImage(
      "معلومات الطلب",
      "18px",
      "bold",
      "#374151"
    );
    const sectionWidth = contentWidth;
    const sectionHeight =
      (sectionCanvas.height * sectionWidth) / sectionCanvas.width;
    pdf.addImage(
      sectionCanvas,
      "JPEG",
      margin,
      currentY,
      sectionWidth,
      sectionHeight
    );
    currentY += sectionHeight + 10;

    // Store the Y position before adding the table for link positioning
    const tableStartY = currentY;

    // Create information table with Arabic text
    const infoContainer = document.createElement("div");
    infoContainer.style.position = "absolute";
    infoContainer.style.left = "-9999px";
    infoContainer.style.top = "0";
    infoContainer.style.width = "800px";
    infoContainer.style.backgroundColor = "white";
    infoContainer.style.padding = "20px";
    infoContainer.style.fontFamily = "Noto Sans Arabic, Arial, sans-serif";
    infoContainer.style.direction = "rtl";
    infoContainer.style.textAlign = "right";
    infoContainer.style.fontSize = "12px";
    infoContainer.innerHTML = `
     <table style="width: 100%; border-collapse: collapse; direction: rtl;">
       <tr style="border-bottom: 1px solid #e5e7eb;">
         <td style="padding: 8px; font-weight: bold; color: #374151; text-align: right;">رقم الطلب:</td>
         <td style="padding: 8px; color: #1f2937; text-align: right;">${record.requestNumber}</td>
       </tr>
       <tr style="border-bottom: 1px solid #e5e7eb;">
         <td style="padding: 8px; font-weight: bold; color: #374151; text-align: right;">رابط الموقع:</td>
         <td style="padding: 8px; color: #3b82f6; text-align: right; text-decoration: underline;">${record.siteLink}</td>
       </tr>
     </table>
   `;

    document.body.appendChild(infoContainer);
    const infoCanvas = await html2canvas(infoContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    });
    document.body.removeChild(infoContainer);

    const infoWidth = contentWidth;
    const infoHeight = (infoCanvas.height * infoWidth) / infoCanvas.width;
    pdf.addImage(infoCanvas, "JPEG", margin, currentY, infoWidth, infoHeight);
    currentY += infoHeight + 20;

    // FIXED: Better link positioning for mobile compatibility
    // Calculate the position of the second row (site link row) in the table
    const rowHeight = infoHeight / 2; // Now only 2 rows in the table
    const linkRowY = tableStartY + rowHeight; // Position of the second row

    // Position the link over the entire second row for better mobile tapping
    const linkX = margin; // Start from the left margin
    const linkWidth = contentWidth; // Cover the entire row width
    const linkHeight = rowHeight; // Cover the entire row height

    // Add link annotation with better positioning
    pdf.link(linkX, linkRowY, linkWidth, linkHeight, { url: record.siteLink });

    // Add images section
    if (validImages.length > 0) {
      // Add section title for images
      const imagesTitleCanvas = await renderArabicTextAsImage(
        "الصور المرفقة",
        "18px",
        "bold",
        "#374151"
      );
      const imagesTitleWidth = contentWidth;
      const imagesTitleHeight =
        (imagesTitleCanvas.height * imagesTitleWidth) / imagesTitleCanvas.width;
      pdf.addImage(
        imagesTitleCanvas,
        "JPEG",
        margin,
        currentY,
        imagesTitleWidth,
        imagesTitleHeight
      );
      currentY += imagesTitleHeight + 20;

      // Process each image individually on separate pages
      for (let i = 0; i < validImages.length; i++) {
        const image = validImages[i];

        // Add a new page for each image
        pdf.addPage();
        currentY = margin;

        // Create temporary container for image processing
        const imgContainer = document.createElement("div");
        imgContainer.style.position = "absolute";
        imgContainer.style.left = "-9999px";
        imgContainer.style.top = "0";
        imgContainer.style.width = "800px";
        imgContainer.style.backgroundColor = "white";
        imgContainer.style.padding = "20px";
        imgContainer.style.fontFamily = "Noto Sans Arabic, Arial, sans-serif";
        imgContainer.style.direction = "rtl";
        imgContainer.style.textAlign = "right";

        imgContainer.innerHTML = `
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; max-width: 100%;">
            <img src="${image}" alt="صورة ${i + 1}" style="width: auto; height: auto; max-width: 100%; display: block;" />
            <div style="padding: 8px; background-color: #f9fafb; text-align: center; font-size: 12px; color: #6b7280; font-family: 'Noto Sans Arabic', Arial, sans-serif;">
              صورة ${i + 1}
            </div>
          </div>
        `;

        document.body.appendChild(imgContainer);

        // Convert image to canvas
        const imageCanvas = await html2canvas(imgContainer, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
        });

        // Calculate image dimensions to fit on the page
        const imageImgWidth = contentWidth;
        const imageImgHeight =
          (imageCanvas.height * imageImgWidth) / imageCanvas.width;

        // Add image to PDF
        pdf.addImage(
          imageCanvas,
          "JPEG",
          margin,
          currentY,
          imageImgWidth,
          imageImgHeight
        );

        // Remove image container
        document.body.removeChild(imgContainer);
      }
    } else {
      // Add "no images" message
      const noImagesCanvas = await renderArabicTextAsImage(
        "لا توجد صور مرفقة",
        "12px",
        "italic",
        "#6b7280"
      );
      const noImagesWidth = contentWidth;
      const noImagesHeight =
        (noImagesCanvas.height * noImagesWidth) / noImagesCanvas.width;
      pdf.addImage(
        noImagesCanvas,
        "JPEG",
        margin,
        currentY,
        noImagesWidth,
        noImagesHeight
      );
    }

    // Convert PDF to blob
    const pdfBlob = pdf.output("blob");
    console.log("✅ PDF generated successfully with enhanced Arabic support");

    // Upload to Firebase Storage
    const timestamp = Date.now();
    const pdfFileName = `reports/${record.requestNumber}_${timestamp}.pdf`;
    const storageRef = ref(storage, pdfFileName);

    console.log("🔄 Uploading PDF to Firebase Storage:", pdfFileName);
    await uploadBytes(storageRef, pdfBlob);
    console.log("✅ PDF uploaded successfully");

    const pdfUrl = await getDownloadURL(storageRef);
    console.log("✅ PDF URL generated:", pdfUrl);

    return pdfUrl;
  } catch (error: unknown) {
    console.error("❌ Error generating and storing PDF:", error);
    throw new Error("فشل في إنشاء وحفظ ملف PDF");
  }
};

export const exportToPDF = async (record: TableRecord) => {
  try {
    // Create PDF with enhanced Arabic support
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210; // A4 width in mm
    const margin = 20; // margin in mm
    const contentWidth = pageWidth - 2 * margin;

    let currentY = margin;

    // Render title as image for perfect Arabic support
    const titleCanvas = await renderArabicTextAsImage(
      "تقرير البيانات",
      "24px",
      "bold",
      "#1f2937"
    );
    const titleWidth = contentWidth;
    const titleHeight = (titleCanvas.height * titleWidth) / titleCanvas.width;
    pdf.addImage(
      titleCanvas,
      "JPEG",
      margin,
      currentY,
      titleWidth,
      titleHeight
    );
    currentY += titleHeight + 10;

    // Add creation date
    const dateCanvas = await renderArabicTextAsImage(
      `تاريخ الإنشاء: ${record.createdDate}`,
      "14px",
      "normal",
      "#6b7280"
    );
    const dateWidth = contentWidth;
    const dateHeight = (dateCanvas.height * dateWidth) / dateCanvas.width;
    pdf.addImage(dateCanvas, "JPEG", margin, currentY, dateWidth, dateHeight);
    currentY += dateHeight + 15;

    // Add section title
    const sectionCanvas = await renderArabicTextAsImage(
      "معلومات الطلب",
      "18px",
      "bold",
      "#374151"
    );
    const sectionWidth = contentWidth;
    const sectionHeight =
      (sectionCanvas.height * sectionWidth) / sectionCanvas.width;
    pdf.addImage(
      sectionCanvas,
      "JPEG",
      margin,
      currentY,
      sectionWidth,
      sectionHeight
    );
    currentY += sectionHeight + 10;

    // Store the Y position before adding the table for link positioning
    const tableStartY = currentY;

    // Create information table with Arabic text
    const infoContainer = document.createElement("div");
    infoContainer.style.position = "absolute";
    infoContainer.style.left = "-9999px";
    infoContainer.style.top = "0";
    infoContainer.style.width = "800px";
    infoContainer.style.backgroundColor = "white";
    infoContainer.style.padding = "20px";
    infoContainer.style.fontFamily = "Noto Sans Arabic, Arial, sans-serif";
    infoContainer.style.direction = "rtl";
    infoContainer.style.textAlign = "right";
    infoContainer.style.fontSize = "12px";
    infoContainer.innerHTML = `
     <table style="width: 100%; border-collapse: collapse; direction: rtl;">
       <tr style="border-bottom: 1px solid #e5e7eb;">
         <td style="padding: 8px; font-weight: bold; color: #374151; text-align: right;">رقم الطلب:</td>
         <td style="padding: 8px; color: #1f2937; text-align: right;">${record.requestNumber}</td>
       </tr>
       <tr style="border-bottom: 1px solid #e5e7eb;">
         <td style="padding: 8px; font-weight: bold; color: #374151; text-align: right;">رابط الموقع:</td>
         <td style="padding: 8px; color: #3b82f6; text-align: right; text-decoration: underline;">${record.siteLink}</td>
       </tr>
     </table>
   `;

    document.body.appendChild(infoContainer);
    const infoCanvas = await html2canvas(infoContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    });
    document.body.removeChild(infoContainer);

    const infoWidth = contentWidth;
    const infoHeight = (infoCanvas.height * infoWidth) / infoCanvas.width;
    pdf.addImage(infoCanvas, "JPEG", margin, currentY, infoWidth, infoHeight);
    currentY += infoHeight + 20;

    // FIXED: Better link positioning for mobile compatibility
    // Calculate the position of the second row (site link row) in the table
    const rowHeight = infoHeight / 2; // Now only 2 rows in the table
    const linkRowY = tableStartY + rowHeight; // Position of the second row

    // Position the link over the entire second row for better mobile tapping
    const linkX = margin; // Start from the left margin
    const linkWidth = contentWidth; // Cover the entire row width
    const linkHeight = rowHeight; // Cover the entire row height

    // Add link annotation with better positioning
    pdf.link(linkX, linkRowY, linkWidth, linkHeight, { url: record.siteLink });

    // Add images section
    if ((record.images?.length || 0) > 0) {
      // Add section title for images
      const imagesTitleCanvas = await renderArabicTextAsImage(
        "الصور المرفقة",
        "18px",
        "bold",
        "#374151"
      );
      const imagesTitleWidth = contentWidth;
      const imagesTitleHeight =
        (imagesTitleCanvas.height * imagesTitleWidth) / imagesTitleCanvas.width;
      pdf.addImage(
        imagesTitleCanvas,
        "JPEG",
        margin,
        currentY,
        imagesTitleWidth,
        imagesTitleHeight
      );
      currentY += imagesTitleHeight + 20;

      // Process each image
      for (let i = 0; i < record.images!.length; i++) {
        const image = record.images![i];

        // Add a new page for each image
        pdf.addPage();
        currentY = margin;

        // Add image title
        const imgTitleCanvas = await renderArabicTextAsImage(
          `الصورة ${i + 1}`,
          "18px",
          "bold",
          "#374151"
        );
        const imgTitleWidth = contentWidth;
        const imgTitleHeight =
          (imgTitleCanvas.height * imgTitleWidth) / imgTitleCanvas.width;
        pdf.addImage(
          imgTitleCanvas,
          "JPEG",
          margin,
          currentY,
          imgTitleWidth,
          imgTitleHeight
        );
        currentY += imgTitleHeight + 20;

        // Create temporary container for image processing
        const imgContainer = document.createElement("div");
        imgContainer.style.position = "absolute";
        imgContainer.style.left = "-9999px";
        imgContainer.style.top = "0";
        imgContainer.style.width = "800px";
        imgContainer.style.backgroundColor = "white";
        imgContainer.style.padding = "20px";
        imgContainer.style.fontFamily = "Noto Sans Arabic, Arial, sans-serif";
        imgContainer.style.direction = "rtl";
        imgContainer.style.textAlign = "right";

        imgContainer.innerHTML = `
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; max-width: 100%;">
            <img src="${image}" alt="صورة ${i + 1}" style="width: auto; height: auto; max-width: 100%; display: block;" />
            <div style="padding: 8px; background-color: #f9fafb; text-align: center; font-size: 12px; color: #6b7280; font-family: 'Noto Sans Arabic', Arial, sans-serif;">
              صورة ${i + 1}
            </div>
          </div>
        `;

        document.body.appendChild(imgContainer);

        // Convert image to canvas
        const imageCanvas = await html2canvas(imgContainer, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
        });

        // Calculate image dimensions to fit on the page
        const imageImgWidth = contentWidth;
        const imageImgHeight =
          (imageCanvas.height * imageImgWidth) / imageCanvas.width;

        // Add image to PDF
        pdf.addImage(
          imageCanvas,
          "JPEG",
          margin,
          currentY,
          imageImgWidth,
          imageImgHeight
        );

        // Remove image container
        document.body.removeChild(imgContainer);
      }
    } else {
      // Add "no images" message
      const noImagesCanvas = await renderArabicTextAsImage(
        "لا توجد صور مرفقة",
        "12px",
        "italic",
        "#6b7280"
      );
      const noImagesWidth = contentWidth;
      const noImagesHeight =
        (noImagesCanvas.height * noImagesWidth) / noImagesCanvas.width;
      pdf.addImage(
        noImagesCanvas,
        "JPEG",
        margin,
        currentY,
        noImagesWidth,
        noImagesHeight
      );
    }

    // Save the PDF
    pdf.save(`تقرير_${record.requestNumber}.pdf`);

    console.log("✅ PDF exported successfully with enhanced Arabic support");
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("فشل في إنشاء ملف PDF");
  }
};
