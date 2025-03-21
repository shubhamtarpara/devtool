"use client";

import { useState } from "react";
import { Maximize2, Minimize2, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function JwtTool() {
  const [input, setInput] = useState("");
  const [decodedHeader, setDecodedHeader] = useState(null);
  const [decodedPayload, setDecodedPayload] = useState(null);
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("payload");

  const decodeToken = () => {
    try {
      // Clear previous results
      setError("");
      setDecodedHeader(null);
      setDecodedPayload(null);
      setSignature("");

      // Validate and split the token
      const parts = input.trim().split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format");
      }

      // Decode header (first part)
      try {
        const headerStr = atob(parts[0]);
        const header = JSON.parse(headerStr);
        setDecodedHeader(header);
      } catch (e) {
        throw new Error("Invalid header encoding");
      }

      // Decode payload (second part)
      try {
        const payloadStr = atob(parts[1]);
        const payload = JSON.parse(payloadStr);
        setDecodedPayload(payload);
      } catch (e) {
        throw new Error("Invalid payload encoding");
      }

      // Store signature
      setSignature(parts[2]);
    } catch (err) {
      setError(err.message || "Invalid JWT token");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <AnimatePresence>
        {isFullscreen && (decodedHeader || decodedPayload) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-white z-50 p-6 overflow-auto"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Decoded JWT
                </h2>
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

              <div className="mb-4 flex space-x-2 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("header")}
                  className={`px-4 py-2 font-medium ${
                    activeTab === "header"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Header
                </button>
                <button
                  onClick={() => setActiveTab("payload")}
                  className={`px-4 py-2 font-medium ${
                    activeTab === "payload"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Payload
                </button>
                <button
                  onClick={() => setActiveTab("signature")}
                  className={`px-4 py-2 font-medium ${
                    activeTab === "signature"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Signature
                </button>
              </div>

              <div className="bg-gray-50 border border-gray-300 rounded-md overflow-auto font-mono h-[calc(100vh-200px)]">
                {activeTab === "header" && decodedHeader && (
                  <pre className="p-4">
                    <code>{JSON.stringify(decodedHeader, null, 2)}</code>
                  </pre>
                )}
                {activeTab === "payload" && decodedPayload && (
                  <pre className="p-4">
                    <code>{JSON.stringify(decodedPayload, null, 2)}</code>
                  </pre>
                )}
                {activeTab === "signature" && (
                  <div className="p-4 break-all">{signature}</div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          JWT Decoder
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              JWT Token
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              placeholder="Enter JWT token to decode"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={decodeToken}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-all duration-300"
          >
            Decode Token
          </motion.button>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          {(decodedHeader || decodedPayload) && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Decoded Token
                </label>
                <div className="flex space-x-2">
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

              <div className="mb-2 flex space-x-2 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("header")}
                  className={`px-3 py-1 text-sm font-medium ${
                    activeTab === "header"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Header
                </button>
                <button
                  onClick={() => setActiveTab("payload")}
                  className={`px-3 py-1 text-sm font-medium ${
                    activeTab === "payload"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Payload
                </button>
                <button
                  onClick={() => setActiveTab("signature")}
                  className={`px-3 py-1 text-sm font-medium ${
                    activeTab === "signature"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Signature
                </button>
              </div>

              <div className="bg-gray-50 border border-gray-300 rounded-md overflow-auto font-mono h-48">
                {activeTab === "header" && decodedHeader && (
                  <div className="relative">
                    <pre className="p-4">
                      <code>{JSON.stringify(decodedHeader, null, 2)}</code>
                    </pre>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        copyToClipboard(JSON.stringify(decodedHeader, null, 2))
                      }
                      className="absolute top-2 right-2 p-1 bg-white hover:bg-gray-100 rounded-md transition-all duration-200 shadow-sm"
                      title="Copy to clipboard"
                    >
                      <Copy className="h-4 w-4" />
                    </motion.button>
                  </div>
                )}
                {activeTab === "payload" && decodedPayload && (
                  <div className="relative">
                    <pre className="p-4">
                      <code>{JSON.stringify(decodedPayload, null, 2)}</code>
                    </pre>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        copyToClipboard(JSON.stringify(decodedPayload, null, 2))
                      }
                      className="absolute top-2 right-2 p-1 bg-white hover:bg-gray-100 rounded-md transition-all duration-200 shadow-sm"
                      title="Copy to clipboard"
                    >
                      <Copy className="h-4 w-4" />
                    </motion.button>
                  </div>
                )}
                {activeTab === "signature" && (
                  <div className="relative">
                    <div className="p-4 break-all">{signature}</div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copyToClipboard(signature)}
                      className="absolute top-2 right-2 p-1 bg-white hover:bg-gray-100 rounded-md transition-all duration-200 shadow-sm"
                      title="Copy to clipboard"
                    >
                      <Copy className="h-4 w-4" />
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
