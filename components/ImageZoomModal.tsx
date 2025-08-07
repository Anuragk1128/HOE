"use client"
import React, { useEffect } from "react"

interface ImageZoomModalProps {
  open: boolean
  imageUrl: string
  onClose: () => void
}

const ImageZoomModal: React.FC<ImageZoomModalProps> = ({ open, imageUrl, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <div className="relative max-w-full max-h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
        <img
          src={imageUrl}
          alt="Zoomed product"
          className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-lg bg-white"
          style={{ touchAction: "pan-y" }}
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 focus:outline-none"
          aria-label="Close zoomed image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ImageZoomModal;