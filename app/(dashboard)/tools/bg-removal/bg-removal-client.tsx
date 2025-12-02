"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Eraser,
  Upload,
  Download,
  Loader2,
  RefreshCw,
  Image as ImageIcon,
  Crop,
  Sparkles,
  SlidersHorizontal,
  LayoutGrid,
  ChevronDown,
  Palette,
  MousePointer2,
} from "lucide-react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import { SOLID_COLORS, BACKGROUND_IMAGES } from "./backgrounds";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ToolbarButton Component
const ToolbarButton = ({
  icon: Icon,
  label,
  isActive = false,
  onClick,
}: {
  icon: any;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}) => {
  const baseClasses =
    "flex items-center justify-center p-3 sm:px-4 sm:py-2 rounded-full transition-all duration-200 cursor-pointer text-sm font-medium";
  const inactiveClasses = "text-gray-600 hover:bg-gray-100/60";
  const activeClasses = "bg-gray-200/80 text-gray-800 shadow-inner";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={`${baseClasses} ${
              isActive ? activeClasses : inactiveClasses
            }`}
          >
            <Icon className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="sm:hidden">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// DownloadButton Component
const DownloadButton = ({
  onDownload,
  disabled,
}: {
  onDownload: () => void;
  disabled?: boolean;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onDownload}
            disabled={disabled}
            className="flex items-center cursor-pointer justify-center p-3 sm:px-4 sm:py-2 rounded-full bg-indigo-600 text-white text-sm font-semibold transition-colors duration-200 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="sm:hidden">
          <p>Download</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// FloatingToolbar Component
const FloatingToolbar = ({
  activeTab,
  onTabChange,
  onDownload,
  isDownloading,
  processedUrl,
  onModeChange,
  mode,
  bgType,
  bgValue,
  onBgChange,
}: {
  activeTab: string | null;
  onTabChange: (tab: string | null) => void;
  onDownload: () => void;
  isDownloading?: boolean;
  processedUrl: string | null;
  onModeChange: (mode: "compare" | "customize") => void;
  mode: "compare" | "customize";
  bgType: "transparent" | "color" | "image";
  bgValue: string;
  onBgChange: (type: "transparent" | "color" | "image", value: string) => void;
}) => {
  const tools = [
    { id: "Compare", label: "Compare", icon: MousePointer2 },
    { id: "Color", label: "Color", icon: Palette },
    { id: "Images", label: "Images", icon: ImageIcon },
    { id: "Upload", label: "Upload", icon: Upload },
  ];

  return (
    <div className="flex flex-col items-center w-full p-4 fixed bottom-0 left-0 right-0 z-50 pointer-events-none gap-2">
      {/* Horizontal Color Strip - Shows when Color tab is active */}
      {activeTab === "Color" && processedUrl && (
        <div
          className="
            bg-white/95 backdrop-blur-md
            rounded-full
            border border-gray-200/50
            shadow-xl
            px-6 py-3
            pointer-events-auto
            animate-in slide-in-from-bottom-2 duration-200
            max-w-4xl w-full
          "
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Palette className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Background:
              </span>
            </div>

            {/* Scrollable Color Row */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1 p-1">
              {/* Transparent Option */}
              <button
                onClick={() => onBgChange("transparent", "")}
                className={`w-10 h-10 flex-shrink-0 rounded-lg border-2 flex items-center justify-center transition-all hover:scale-110 ${
                  bgType === "transparent"
                    ? "border-indigo-600 ring-2 ring-indigo-200 shadow-lg scale-105"
                    : "border-gray-300 hover:border-indigo-400"
                }`}
                title="Transparent"
              >
                <div className="w-8 h-8 bg-checkerboard rounded" />
              </button>

              {/* Color Swatches */}
              {SOLID_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => onBgChange("color", color)}
                  className={`w-10 h-10 flex-shrink-0 rounded-lg border-2 transition-all hover:scale-110 ${
                    bgType === "color" && bgValue === color
                      ? "border-indigo-600 ring-2 ring-indigo-200 shadow-lg scale-105"
                      : "border-white/80 hover:border-indigo-400 shadow-sm"
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Horizontal Images Strip - Shows when Images tab is active */}
      {activeTab === "Images" && processedUrl && (
        <div
          className="
            bg-white/95 backdrop-blur-md
            rounded-full
            border border-gray-200/50
            shadow-xl
            px-6 py-3
            pointer-events-auto
            animate-in slide-in-from-bottom-2 duration-200
            max-w-4xl w-full
          "
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 flex-shrink-0">
              <ImageIcon className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Background Image:
              </span>
            </div>

            {/* Scrollable Images Row */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1 p-1">
              <TooltipProvider>
                {BACKGROUND_IMAGES.map((img) => (
                  <Tooltip key={img.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          onBgChange("image", img.url);
                          onModeChange("customize");
                        }}
                        className={`relative w-16 h-10 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                          bgType === "image" && bgValue === img.url
                            ? "border-indigo-600 ring-2 ring-indigo-100 shadow-md scale-105"
                            : "border-gray-200 hover:border-indigo-400"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.name}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    </TooltipTrigger>

                    {/* Tooltip with larger image */}
                    <TooltipContent className="p-0 rounded-lg shadow-lg">
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-40 h-24 object-cover rounded-md"
                      />
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </div>
      )}

      {/* Horizontal Upload Strip - Shows when Upload tab is active */}
      {activeTab === "Upload" && processedUrl && (
        <div
          className="
            bg-white/95 backdrop-blur-md
            rounded-full
            border border-gray-200/50
            shadow-xl
            px-4 sm:px-6 py-3
            pointer-events-auto
            animate-in slide-in-from-bottom-2 duration-200
            max-w-4xl w-auto
          "
        >
          <div className="flex items-center gap-4 justify-center">
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <Upload className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Upload Background:
              </span>
            </div>

            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    onBgChange("image", url);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-white hover:bg-gray-50"
              >
                <Upload className="w-3 h-3" />
                <span className="hidden sm:inline">Choose</span> Image
              </Button>
            </div>

            <p className="hidden sm:block text-xs text-gray-500">
              Supports PNG, JPG, WebP
            </p>
          </div>
        </div>
      )}

      {/* Main Toolbar */}
      <div
        className="
          flex items-center justify-evenly
          p-2 sm:p-3
          rounded-full
          border border-gray-200/50
          shadow-xl
          bg-white/30
          backdrop-blur-md
          max-w-xs sm:max-w-2xl w-full
          transition-all duration-300
          pointer-events-auto
        "
        style={{
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
        }}
      >
        {/* Tools spread evenly */}
        {tools.map((tool) => (
          <ToolbarButton
            key={tool.id}
            icon={tool.icon}
            label={tool.label}
            isActive={
              tool.id === "Compare"
                ? mode === "compare" && processedUrl !== null
                : activeTab === tool.id
            }
            onClick={() => {
              if (tool.id === "Compare") {
                // Enable compare mode and close side panel
                if (processedUrl) {
                  onModeChange("compare");
                  onTabChange(null);
                }
              } else {
                // Toggle inline strip (Color, Images, Upload)
                const newTab = activeTab === tool.id ? null : tool.id;
                onTabChange(newTab);
                if (newTab && processedUrl) {
                  onModeChange("customize");
                }
              }
            }}
          />
        ))}

        {/* Download Button */}
        <DownloadButton
          onDownload={onDownload}
          disabled={!processedUrl || isDownloading}
        />
      </div>
    </div>
  );
};

export default function BgRemovalClient() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Customize State
  const [mode, setMode] = useState<"compare" | "customize">("compare");
  const [bgType, setBgType] = useState<"transparent" | "color" | "image">(
    "transparent"
  );
  const [bgValue, setBgValue] = useState<string>(""); // Color hex or Image URL
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeToolbarTab, setActiveToolbarTab] = useState<string | null>(null);

  // Image dimensions state
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const validateImageFile = (file: File): string | null => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return "Please upload a valid image file (PNG, JPG, JPEG, or WebP).";
    }
    if (file.size > 50 * 1024 * 1024) {
      return "File size exceeds 50MB limit. Please upload a smaller image.";
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validationError = validateImageFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setProcessedUrl(null);
      setError(null);
      setMode("compare");
      setBgType("transparent");
      setActiveToolbarTab(null);

      // Load image to get dimensions
      const img = new Image();
      img.onload = () => {
        setImageDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = url;
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProcessedUrl(null);
    setError(null);
    setMode("compare");
    setBgType("transparent");
    setActiveToolbarTab(null);
    setImageDimensions(null);
  };

  const handleProcess = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);
    setLoadingStep("Analyzing image...");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Update status after 3 seconds
      const timeout = setTimeout(() => {
        setLoadingStep("Removing background...");
      }, 3000);

      // Call Next.js API route (which handles auth and forwards to backend)
      const response = await fetch("/api/bg-removal", {
        method: "POST",
        body: formData,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || errorData.detail || "Failed to process image"
        );
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setProcessedUrl(url);
    } catch (err) {
      console.error(err);
      setError("Failed to process image. Please try again.");
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  // Handle Custom Background Upload
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBgType("image");
      setBgValue(url);
      setMode("customize");
    }
  };

  // Canvas Merging Logic for Download
  const handleCompositeDownload = async () => {
    if (!processedUrl) return;
    setIsDownloading(true);

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 1. Load Foreground (Subject) to get dimensions
      const foreground = new Image();
      foreground.crossOrigin = "anonymous";
      foreground.src = processedUrl;

      await new Promise((resolve) => {
        foreground.onload = resolve;
      });

      // Set canvas to match the subject's size
      canvas.width = foreground.naturalWidth;
      canvas.height = foreground.naturalHeight;

      // 2. Draw Background
      if (bgType === "color") {
        ctx.fillStyle = bgValue;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (bgType === "image" && bgValue) {
        const background = new Image();
        background.crossOrigin = "anonymous";
        background.src = bgValue;
        await new Promise((resolve, reject) => {
          background.onload = resolve;
          background.onerror = () => resolve(null); // Skip bg if fail
        });

        // Draw background covering the canvas (Aspect Fill)
        const ratio = Math.max(
          canvas.width / background.naturalWidth,
          canvas.height / background.naturalHeight
        );
        const centerShift_x =
          (canvas.width - background.naturalWidth * ratio) / 2;
        const centerShift_y =
          (canvas.height - background.naturalHeight * ratio) / 2;
        ctx.drawImage(
          background,
          0,
          0,
          background.naturalWidth,
          background.naturalHeight,
          centerShift_x,
          centerShift_y,
          background.naturalWidth * ratio,
          background.naturalHeight * ratio
        );
      }

      // 3. Draw Foreground
      ctx.drawImage(foreground, 0, 0);

      // 4. Trigger Download
      const link = document.createElement("a");
      link.download = `custom-bg-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download failed", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={`max-w-5xl mx-auto w-full ${previewUrl ? "pb-24" : ""}`}>
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 text-center rounded-lg border border-red-200 font-medium mb-4">
          Error: {error}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Main Canvas / Preview Area */}
        <div
          className="w-full flex items-center justify-center relative overflow-hidden py-4 md:py-8 flex-1"
          style={{ minHeight: previewUrl ? "500px" : "400px" }}
        >
          {/* Floating Buttons */}
          {previewUrl && (
            <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleReset}
                disabled={isLoading}
                className="bg-white/90 backdrop-blur hover:bg-white shadow-sm border cursor-pointer shrink-0"
              >
                <RefreshCw className="h-3.5 w-3.5 sm:mr-2" />
                <span className="hidden sm:inline">New Image</span>
              </Button>
              {!processedUrl && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleProcess}
                  disabled={isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin sm:mr-2" />
                      <span className="hidden sm:inline">
                        {loadingStep || "Processing..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <Eraser className="h-3.5 w-3.5 sm:mr-2" />
                      <span className="hidden sm:inline">
                        Remove Background
                      </span>
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          {!previewUrl ? (
            // Upload State
            <div className="w-full flex items-center justify-center min-h-[400px]">
              <div className="relative group cursor-pointer w-full max-w-2xl">
                <div className="absolute inset-0 bg-indigo-500/5 blur-2xl rounded-full group-hover:bg-indigo-500/10 transition-all duration-500" />
                <div className="relative bg-white border-2 border-dashed border-gray-200 rounded-2xl p-16 hover:border-indigo-500/50 hover:shadow-lg transition-all duration-300">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={isLoading}
                  />
                  <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                    Upload an image
                  </h3>
                  <p className="text-gray-500 text-sm mb-6 text-center">
                    Drag and drop or click to browse
                  </p>
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                    <span>PNG</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>JPG</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>WEBP</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Display State - Preview with Compare/Customize Modes
            <div className="relative w-full flex items-center justify-center p-4 md:p-8 flex-1 min-h-[400px]">
              <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg flex items-center justify-center relative max-w-full max-h-full w-auto h-auto">
                {/* Compare Mode - Slider */}
                {mode === "compare" && processedUrl ? (
                  <ReactCompareSlider
                    itemOne={
                      <ReactCompareSliderImage
                        src={previewUrl!}
                        alt="Original"
                        style={{
                          objectFit: "contain",
                          maxWidth: "100%",
                          maxHeight: "calc(100vh - 400px)",
                          width: "auto",
                          height: "auto",
                        }}
                      />
                    }
                    itemTwo={
                      <ReactCompareSliderImage
                        src={processedUrl}
                        alt="Result"
                        className="bg-checkerboard"
                        style={{
                          objectFit: "contain",
                          maxWidth: "100%",
                          maxHeight: "calc(100vh - 400px)",
                          width: "auto",
                          height: "auto",
                        }}
                      />
                    }
                    style={{
                      display: "flex",
                      width: "auto",
                      height: "auto",
                      maxWidth: "100%",
                      maxHeight: "calc(100vh - 400px)",
                    }}
                  />
                ) : mode === "customize" && processedUrl ? (
                  // Customize Mode - With Background
                  <div
                    className="relative flex items-center justify-center"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "calc(100vh - 400px)",
                    }}
                  >
                    <div
                      className="relative"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "calc(100vh - 400px)",
                      }}
                    >
                      {/* Background Layer */}
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundColor:
                            bgType === "color" ? bgValue : "transparent",
                          backgroundImage:
                            bgType === "image"
                              ? `url(${bgValue})`
                              : bgType === "transparent"
                              ? undefined
                              : "none",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        {bgType === "transparent" && (
                          <div className="w-full h-full bg-checkerboard" />
                        )}
                      </div>
                      {/* Foreground Layer */}
                      <img
                        src={processedUrl}
                        alt="Foreground"
                        className="relative z-10 object-contain"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "calc(100vh - 400px)",
                          width: "auto",
                          height: "auto",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  // Default Preview
                  <img
                    src={previewUrl!}
                    alt="Preview"
                    className="object-contain"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "calc(100vh - 400px)",
                      width: "auto",
                      height: "auto",
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Controls Section - COMMENTED OUT */}
        {/* {previewUrl && (
              <div className="w-full bg-white border-t border-gray-200 p-6 flex flex-col gap-6 z-20 max-w-2xl mx-auto">
                                    <div className="flex flex-col h-full items-center justify-center text-center space-y-4">
                  <Button
                    onClick={handleProcess}
                    size="lg"
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        {loadingStep || "Processing..."}
                      </>
                    ) : (
                      <>
                        <Eraser className="mr-2 h-4 w-4" /> Remove Background
                      </>
                    )}
                                                </Button>
                  <p className="text-xs text-gray-500">
                    AI processing takes 2-5 seconds
                  </p>
                                                </div>
                                            </div>
            )} */}
      </div>

      <style jsx global>{`
        .bg-checkerboard {
          background-color: white;
          background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
            linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Floating Glass Toolbar */}
      {!isLoading && previewUrl && processedUrl && (
        <FloatingToolbar
          activeTab={activeToolbarTab}
          onTabChange={(tab) => {
            setActiveToolbarTab(tab);
            // Auto-enable compare mode when Compare tab is selected
            if (tab === "Compare" && processedUrl) {
              setMode("compare");
            }
          }}
          onDownload={handleCompositeDownload}
          isDownloading={isDownloading}
          processedUrl={processedUrl}
          onModeChange={setMode}
          mode={mode}
          bgType={bgType}
          bgValue={bgValue}
          onBgChange={(type, value) => {
            setBgType(type);
            setBgValue(value);
            setMode("customize");
          }}
        />
      )}
    </div>
  );
}
