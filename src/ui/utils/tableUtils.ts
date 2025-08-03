import { FormData, TableRecord } from "src/types/form-data.type";
import { generateAndStorePDF } from "./pdfUtils";

export const createTableRecord = async (
  values: FormData
): Promise<Omit<TableRecord, "key">> => {
  const fileList = values.images?.fileList || [];

  // Create record with image files (not URLs)
  const record = {
    requestNumber: values.requestNumber,
    siteLink: values.siteLink,
    createdDate: new Date().toLocaleString("ar-SA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };

  // Generate and store PDF with images embedded
  try {
    console.log("🔄 Generating PDF for record...");
    console.log(
      "📁 File list:",
      fileList.map((f) => f.name)
    );
    const pdfUrl = await generateAndStorePDF(record as TableRecord, fileList);
    console.log("✅ PDF generated and stored:", pdfUrl);
    return {
      ...record,
      pdfUrl,
    };
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
    console.error("❌ Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    // Return record without PDF URL if PDF generation fails
    return record;
  }
};
