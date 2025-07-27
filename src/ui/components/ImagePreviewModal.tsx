import { Modal, Image, Button } from "antd";
import { LeftOutlined, RightOutlined, CloseOutlined } from "@ant-design/icons";
import { useState } from "react";

interface ImagePreviewModalProps {
  visible: boolean;
  images: string[];
  onClose: () => void;
}

export const ImagePreviewModal = ({
  visible,
  images,
  onClose,
}: ImagePreviewModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleClose = () => {
    setCurrentImageIndex(0);
    onClose();
  };

  return (
    <Modal
      open={visible}
      title={
        <div className="flex items-center justify-between">
          <span>معاينة الصور</span>
          <span className="text-sm text-gray-500">
            {currentImageIndex + 1} من {images.length}
          </span>
        </div>
      }
      footer={null}
      onCancel={handleClose}
      width={900}
      className="image-preview-modal"
    >
      {images.length > 0 && (
        <div className="space-y-4">
          {/* Main Image Display */}
          <div className="relative">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={images[currentImageIndex]}
                alt={`صورة ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
                preview={false}
              />
            </div>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <Button
                  type="primary"
                  shape="circle"
                  icon={<LeftOutlined />}
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                />
                <Button
                  type="primary"
                  shape="circle"
                  icon={<RightOutlined />}
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                />
              </>
            )}
          </div>

          {/* Thumbnail Grid */}
          {images.length > 1 && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-3 text-gray-700">
                جميع الصور ({images.length})
              </h4>
              <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`aspect-square cursor-pointer rounded border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-blue-500 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={image}
                      alt={`صورة مصغرة ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                      preview={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              type="default"
              icon={<CloseOutlined />}
              onClick={handleClose}
            >
              إغلاق
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
