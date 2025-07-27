import { useState, useCallback } from "react";

export const useImagePreview = () => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handlePreview = useCallback((images: string[]) => {
    setPreviewImages(images);
    setPreviewVisible(true);
  }, []);

  const closePreview = useCallback(() => {
    setPreviewVisible(false);
  }, []);

  return {
    previewVisible,
    previewImages,
    handlePreview,
    closePreview,
  };
};
