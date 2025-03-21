"use client";

import { useState, useRef } from "react";
import {
  Maximize2,
  Minimize2,
  Copy,
  Upload,
  Download,
  Image,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Base64ImageTool() {
  const [mode, setMode] = useState("encode");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [base64Output, setBase64Output] = useState("");
  const [decodedImage, setDecodedImage] = useState(null);
  const [base64Input, setBase64Input] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setError("");
    const reader = new FileReader();

    // For image preview
    const previewReader = new FileReader();
    previewReader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    previewReader.readAsDataURL(file);

    // For base64 conversion
    reader.onload = (e) => {
      const base64String = e.target.result;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64Content = base64String.split(",")[1];
      setBase64Output(base64Content);
    };
    reader.readAsDataURL(file);
  };

  const handleDecode = () => {
    try {
      setError("");
      // Validate base64 input
      if (!base64Input.trim()) {
        setError("Please enter a Base64 string");
        return;
      }

      // Try to determine if the input already has a data URL prefix
      let fullDataUrl;
      if (base64Input.startsWith("data:image/")) {
        fullDataUrl = base64Input;
      } else {
        // Assume it's a raw base64 string and add a generic image data URL prefix
        fullDataUrl = `data:image/png;base64,${base64Input}`;
      }

      setDecodedImage(fullDataUrl);
    } catch (error) {
      setError("Invalid Base64 string");
      setDecodedImage(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const downloadDecodedImage = () => {
    if (!decodedImage) return;

    const link = document.createElement("a");
    link.href = decodedImage;
    link.download = "decoded-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-white z-50 p-6 overflow-auto"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Output</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFullscreen(false)}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  title="Exit fullscreen"
                >
                  <Minimize2 className="h-5 w-5" />
                </motion.button>
              </div>
              {mode === "encode" ? (
                <textarea
                  value={base64Output}
                  readOnly
                  className="w-full h-[calc(100vh-200px)] px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono transition-all duration-300"
                />
              ) : (
                <div className="flex flex-col items-center">
                  {decodedImage && (
                    <img
                      src={decodedImage}
                      alt="Decoded"
                      className="max-w-full max-h-[calc(100vh-200px)] object-contain border border-gray-300 rounded-md"
                    />
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Base64 Image Converter
          </h2>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode("encode")}
              className={`px-4 py-2 text-sm rounded-md transition-all duration-300 ${
                mode === "encode"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Encode
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode("decode")}
              className={`px-4 py-2 text-sm rounded-md transition-all duration-300 ${
                mode === "decode"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Decode
            </motion.button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {mode === "encode" ? (
            <>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="space-y-2">
                  <Image className="h-12 w-12 mx-auto text-gray-400" />
                  <div className="text-sm text-gray-600">
                    Drag and drop an image, or
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={triggerFileInput}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-300 inline-flex items-center"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Browse
                  </motion.button>
                </div>
              </div>

              {imagePreview && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Preview
                  </label>
                  <div className="border border-gray-300 rounded-md p-2 flex justify-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48 object-contain"
                    />
                  </div>
                </div>
              )}

              {base64Output && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Base64 Output
                    </label>
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => copyToClipboard(base64Output)}
                        className="p-1 hover:bg-gray-100 rounded-md transition-all duration-200"
                        title="Copy to clipboard"
                      >
                        <Copy className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsFullscreen(true)}
                        className="p-1 hover:bg-gray-100 rounded-md transition-all duration-200"
                        title="View fullscreen"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                  <textarea
                    value={base64Output}
                    readOnly
                    className="w-full h-32 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono transition-all duration-300"
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base64 Input
                </label>
                <textarea
                  value={base64Input}
                  onChange={(e) => setBase64Input(e.target.value)}
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  placeholder="Enter base64 encoded image data"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDecode}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-all duration-300"
              >
                Decode
              </motion.button>

              {decodedImage && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Decoded Image
                    </label>
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={downloadDecodedImage}
                        className="p-1 hover:bg-gray-100 rounded-md transition-all duration-200"
                        title="Download image"
                      >
                        <Download className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsFullscreen(true)}
                        className="p-1 hover:bg-gray-100 rounded-md transition-all duration-200"
                        title="View fullscreen"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                  <div className="border border-gray-300 rounded-md p-2 flex justify-center">
                    <img
                      src={decodedImage}
                      alt="Decoded"
                      className="max-h-48 object-contain"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
