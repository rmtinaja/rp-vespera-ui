import { useEffect, useRef, useState } from "react";
import { X, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface MobileIdPreviewProps {
  previewUrl: string | null;
  fileName?: string;
  onRemove?: () => void;
}

export default function MobileIdPreview({
  previewUrl,
  fileName,
  onRemove,
}: MobileIdPreviewProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset state when a new image is loaded
  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setLoaded(false);
  }, [previewUrl]);

  if (!previewUrl) return null;

  const handleLoad = () => {
    if (imgRef.current) {
      setNaturalSize({
        w: imgRef.current.naturalWidth,
        h: imgRef.current.naturalHeight,
      });
    }
    setLoaded(true);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  // Detect portrait orientation after rotation
  const isRotated90or270 = rotation === 90 || rotation === 270;

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-gray-50 overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-white">
        <span className="text-xs font-medium text-gray-600 truncate max-w-[60%]">
          {fileName || "ID Preview"}
        </span>
        <div className="flex items-center gap-2">
          {/* Zoom out */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-40 transition-colors"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4 text-gray-600" />
          </button>

          {/* Zoom level */}
          <span className="text-xs text-gray-400 w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>

          {/* Zoom in */}
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-40 transition-colors"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4 text-gray-600" />
          </button>

          {/* Rotate */}
          <button
            type="button"
            onClick={handleRotate}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Rotate image"
          >
            <RotateCw className="w-4 h-4 text-gray-600" />
          </button>

          {/* Remove */}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="p-1.5 rounded-full hover:bg-red-50 transition-colors"
              aria-label="Remove image"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          )}
        </div>
      </div>

      {/* Image viewport — fixed height, scrollable if zoomed */}
      <div
        className="relative w-full overflow-auto bg-gray-100"
        style={{ minHeight: "200px", maxHeight: "300px" }}
      >
        {/* Skeleton loader */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-green-500 animate-spin" />
          </div>
        )}

        {/* Image wrapper — centers image and applies transforms */}
        <div
          className="flex items-center justify-center"
          style={{
            minHeight: "200px",
            padding: "12px",
            // When rotated 90/270, we need extra width so the rotated image fits
            minWidth: isRotated90or270 && naturalSize
              ? `${naturalSize.h * zoom}px`
              : undefined,
          }}
        >
          <img
            ref={imgRef}
            src={previewUrl}
            alt="Government ID"
            onLoad={handleLoad}
            style={{
              display: "block",
              maxWidth: "100%",
              maxHeight: "276px",
              objectFit: "contain",
              transform: `rotate(${rotation}deg) scale(${zoom})`,
              transformOrigin: "center center",
              transition: "transform 0.2s ease",
              opacity: loaded ? 1 : 0,
              // Prevent transform clipping at edge
              margin: isRotated90or270 ? "auto" : undefined,
            }}
          />
        </div>
      </div>

      {/* Footer: image dimensions */}
      {loaded && naturalSize && (
        <div className="px-3 py-1.5 border-t border-gray-200 bg-white">
          <p className="text-xs text-gray-400">
            {naturalSize.w} × {naturalSize.h}px
          </p>
        </div>
      )}
    </div>
  );
}
