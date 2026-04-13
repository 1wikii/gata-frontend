"use client";

import React, { useRef, useState, useEffect } from "react";
import { Trash2, Download, Upload, PenTool } from "lucide-react";

interface SignatureInputProps {
  value?: string; // Base64 encoded signature or image URL
  onChange: (signatureData: string) => void; // Callback when signature changes
  onError?: (error: string) => void; // Callback for errors
  disabled?: boolean;
}

export const SignatureInput: React.FC<SignatureInputProps> = ({
  value,
  onChange,
  onError,
  disabled = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!value);
  const [previewUrl, setPreviewUrl] = useState<string>(value || "");
  const [isHovering, setIsHovering] = useState(false);

  // Create custom pen cursor
  const penCursor = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23000000' stroke-width='2'%3E%3Cpath d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'/%3E%3Cpath d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'/%3E%3C/svg%3E`;

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Set canvas size to square (288px = 72 * 4, matches w-72 h-72 in Tailwind)
    canvas.width = 288;
    canvas.height = 288;

    // Draw white background
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // If there's an existing signature from props, display it
    if (value) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        // Clear canvas first
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the existing signature image
        context.drawImage(img, 0, 0, canvas.width, canvas.height);

        setHasSignature(true);
      };
      img.onerror = () => {
        console.warn("Failed to load existing signature image");
      };
      img.src = process.env.NEXT_PUBLIC_SERVER_BASE_URL + value;
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    // Calculate scale factor to convert CSS coordinates to canvas coordinates
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    // Calculate scale factor to convert CSS coordinates to canvas coordinates
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    context.lineWidth = 2;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#000000";
    context.lineTo(x, y);
    context.stroke();

    setHasSignature(true);
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.closePath();
    setIsDrawing(false);

    // Convert canvas to base64
    const signatureData = canvas.toDataURL("image/png");
    setPreviewUrl(signatureData);
    onChange(signatureData);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Clear canvas
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    setHasSignature(false);
    setPreviewUrl("");
    onChange("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      const errorMsg = "File harus berupa gambar";
      onError?.(errorMsg);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      const errorMsg = "Ukuran file terlalu besar (maksimal 5MB)";
      onError?.(errorMsg);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;

      // Compress/resize image
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        // Reset canvas to square (288x288)
        canvas.width = 288;
        canvas.height = 288;

        // Draw white background
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate scaling to fit image in canvas while maintaining aspect ratio
        const scale = Math.min(
          (canvas.width - 4) / img.width,
          (canvas.height - 4) / img.height
        );
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;

        // Draw image
        context.drawImage(img, x, y, img.width * scale, img.height * scale);

        // Convert to base64
        const signatureData = canvas.toDataURL("image/png");
        setPreviewUrl(signatureData);
        setHasSignature(true);
        onChange(signatureData);
      };
      img.src = imageData;
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownload = () => {
    if (!previewUrl) return;

    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = `signature-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="space-y-3">
      {/* Instructions */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900 font-medium mb-2">📝 Instruksi:</p>
        <ul className="text-xs text-blue-800 space-y-1 ml-4 list-disc">
          <li>Hindari menyisakan banyak area putih kosong</li>
          <li>Atau unggah gambar tanda tangan Anda</li>
          <li className="font-bold">
            Pastikan background transparan atau berwarna putih jika mengunggah
            gambar
          </li>
        </ul>
      </div>

      {/* Canvas for drawing signature - Square */}
      <div className="flex justify-center">
        <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden w-72 h-72">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={() => {
              stopDrawing();
              setIsHovering(false);
            }}
            onMouseEnter={() => setIsHovering(true)}
            className="w-full h-full bg-white block"
            style={{
              touchAction: "none",
              cursor: disabled
                ? "not-allowed"
                : isHovering
                ? `url('${penCursor}') 12 12, crosshair`
                : "auto",
              opacity: disabled ? 0.6 : 1,
            }}
          />
        </div>
      </div>

      {/* Info text */}
      <p className="text-xs text-gray-500 text-center">
        Tanda tangan akan ditampilkan di area persegi di atas
      </p>

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          type="button"
          onClick={handleClear}
          disabled={!hasSignature || disabled}
          className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          <Trash2 className="w-4 h-4" />
          Hapus
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          <Upload className="w-4 h-4" />
          Unggah Gambar
        </button>

        <button
          type="button"
          onClick={handleDownload}
          disabled={!hasSignature || disabled}
          className="inline-flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          Unduh
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};
