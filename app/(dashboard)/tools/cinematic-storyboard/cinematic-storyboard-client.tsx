"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Download,
  Loader2,
  RefreshCw,
  Film,
  Sparkles,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function CinematicStoryboardClient() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Advanced options
  const [sceneType, setSceneType] = useState<string>("");
  const [mood, setMood] = useState<string>("");
  const [customPrompt, setCustomPrompt] = useState<string>("");

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
      setResultUrl(null);
      setError(null);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setError(null);
    setSceneType("");
    setMood("");
    setCustomPrompt("");
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("source_image", selectedFile);
      if (sceneType) formData.append("scene_type", sceneType);
      if (mood) formData.append("mood", mood);
      if (customPrompt) formData.append("custom_prompt", customPrompt);

      const response = await fetch("/api/cinematic-storyboard", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate storyboard");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err: any) {
      console.error(err);
      setError(
        err.message || "Failed to generate storyboard. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `cinematic-storyboard-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 text-center rounded-lg border border-red-200 font-medium mb-4">
          Error: {error}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Upload Section */}
        {!previewUrl ? (
          <div className="w-full flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
            <div className="relative group cursor-pointer w-full max-w-2xl">
              <div className="absolute inset-0 bg-indigo-500/5 blur-2xl rounded-full group-hover:bg-indigo-500/10 transition-all duration-500" />
              <div className="relative bg-white border-2 border-dashed border-gray-200 rounded-2xl p-8 sm:p-16 hover:border-indigo-500/50 hover:shadow-lg transition-all duration-300">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={isLoading}
                />
                <div className="bg-indigo-50 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Film className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 text-center">
                  Upload an image for storyboarding
                </h3>
                <p className="text-gray-500 text-sm mb-4 sm:mb-6 text-center">
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
          <>
            {/* Action Buttons - Outside the image container for better mobile UX */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleReset}
                disabled={isLoading}
                className="bg-white hover:bg-gray-50 shadow-sm border cursor-pointer"
              >
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                New Image
              </Button>
              {resultUrl && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleDownload}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer"
                >
                  <Download className="mr-2 h-3.5 w-3.5" />
                  Download
                </Button>
              )}
            </div>

            {/* Preview/Result Section */}
            <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg p-4 sm:p-8 min-h-[300px] sm:min-h-[500px] flex items-center justify-center">
              {resultUrl ? (
                <img
                  src={resultUrl}
                  alt="Storyboard Result"
                  className="max-w-full max-h-[400px] sm:max-h-[600px] object-contain rounded-lg shadow-xl"
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full max-h-[300px] sm:max-h-[400px] object-contain rounded-lg"
                />
              )}
            </div>

            {/* Options and Generate Section */}
            {!resultUrl && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Storyboard Options
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scene Type (Optional)
                    </label>
                    <Select value={sceneType} onValueChange={setSceneType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select scene type..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="action">Action</SelectItem>
                        <SelectItem value="drama">Drama</SelectItem>
                        <SelectItem value="romance">Romance</SelectItem>
                        <SelectItem value="thriller">Thriller</SelectItem>
                        <SelectItem value="horror">Horror</SelectItem>
                        <SelectItem value="scifi">Sci-Fi</SelectItem>
                        <SelectItem value="comedy">Comedy</SelectItem>
                        <SelectItem value="documentary">Documentary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mood/Tone (Optional)
                    </label>
                    <Select value={mood} onValueChange={setMood}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mood..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tense">Tense</SelectItem>
                        <SelectItem value="upbeat">Upbeat</SelectItem>
                        <SelectItem value="melancholic">Melancholic</SelectItem>
                        <SelectItem value="mysterious">Mysterious</SelectItem>
                        <SelectItem value="energetic">Energetic</SelectItem>
                        <SelectItem value="calm">Calm</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="bright">Bright</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Instructions (Optional)
                  </label>
                  <Textarea
                    placeholder="Add specific camera angles or instructions..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 sm:py-6 text-base sm:text-lg cursor-pointer"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span className="hidden sm:inline">
                        Generating Storyboard...
                      </span>
                      <span className="sm:hidden">Generating...</span>
                    </>
                  ) : (
                    <>
                      <Film className="mr-2 h-5 w-5" />
                      Generate Storyboard
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Generation takes 10-20 seconds. The storyboard will show 6
                  shots with different camera angles.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
