"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PenTool,
  Upload,
  Download,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

export default function HandDrawnPortraitClient() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProcessedUrl(null);
    setError(null);
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
        setLoadingStep("Generating hand-drawn portrait...");
      }, 3000);

      // Call Next.js API route (which handles auth and forwards to backend)
      const response = await fetch("/api/hand-drawn-portrait", {
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

  const handleDownload = () => {
    if (!processedUrl) return;
    setIsDownloading(true);

    try {
      const link = document.createElement("a");
      link.download = `hand-drawn-portrait-${Date.now()}.png`;
      link.href = processedUrl;
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
            <div className="absolute top-4 left-4 right-4 z-10 flex justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleReset}
                disabled={isLoading}
                className="bg-white/90 backdrop-blur hover:bg-white shadow-sm border cursor-pointer"
              >
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                New Image
              </Button>
              {!processedUrl && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleProcess}
                  disabled={isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      {loadingStep || "Processing..."}
                    </>
                  ) : (
                    <>
                      <PenTool className="mr-2 h-3.5 w-3.5" />
                      Generate Portrait
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
            // Display State - Compare Slider or Preview
            <div className="relative w-full flex items-center justify-center p-4 md:p-8 flex-1 min-h-[400px]">
              <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg flex items-center justify-center relative max-w-full max-h-full w-auto h-auto">
                {processedUrl ? (
                  // Compare Mode - Slider
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
                        alt="Hand-Drawn Portrait"
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
      </div>

      {/* Floating Download Button */}
      {!isLoading && previewUrl && processedUrl && (
        <div className="flex flex-col items-center w-full p-4 fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
          <div
            className="
              flex items-center justify-center
              p-2 sm:p-3
              rounded-full
              border border-gray-200/50
              shadow-xl
              bg-white/30
              backdrop-blur-md
              max-w-xs w-full
              transition-all duration-300
              pointer-events-auto
            "
            style={{
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
            }}
          >
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center cursor-pointer justify-center px-4 py-2 rounded-full bg-indigo-600 text-white font-semibold transition-colors duration-200 hover:bg-indigo-700 h-full disabled:opacity-50 disabled:cursor-not-allowed w-full"
            >
              <Download className="w-5 h-5 mr-2" />
              <span>Download</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

