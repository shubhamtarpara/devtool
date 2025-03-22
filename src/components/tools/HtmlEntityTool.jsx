"use client";

import { useState } from "react";
import { Maximize2, Minimize2, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function HtmlEntityTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("encode");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  // HTML Entity encoding function
  const htmlEntityEncode = (str) => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/\//g, "&#x2F;")
      .replace(/`/g, "&#x60;")
      .replace(/=/g, "&#x3D;");
  };

  // HTML Entity decoding function
  const htmlEntityDecode = (str) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = str;
    return textarea.value;
  };

  const handleConvert = () => {
    try {
      if (mode === "encode") {
        setOutput(htmlEntityEncode(input));
      } else {
        setOutput(htmlEntityDecode(input));
      }
    } catch (error) {
      setOutput("Invalid input: " + error.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              <textarea
                value={output}
                readOnly
                className="w-full h-[calc(100vh-120px)] px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono transition-all duration-300"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            HTML Entity Encoder/Decoder
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

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Input
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              placeholder={
                mode === "encode"
                  ? "Enter text to encode HTML entities"
                  : "Enter HTML entities to decode"
              }
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConvert}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-all duration-300"
          >
            Convert
          </motion.button>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Output
              </label>
              {output && (
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCopy}
                    className="p-1 hover:bg-gray-100 rounded-md transition-all duration-200"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
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
              )}
            </div>
            <textarea
              value={output}
              readOnly
              className="w-full h-32 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </>
  );
}
