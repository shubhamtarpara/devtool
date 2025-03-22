"use client";

import { useState, useRef, useEffect } from "react";
import { Maximize2, Minimize2, Copy, Check, Code2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function HtmlPreviewTool() {
  const [input, setInput] = useState(
    "<!DOCTYPE html>\n<html>\n<head>\n  <title>HTML Preview</title>\n  <style>\n    body {\n      font-family: Arial, sans-serif;\n      margin: 20px;\n      line-height: 1.6;\n    }\n    h1 {\n      color: #4f46e5;\n    }\n    p {\n      margin-bottom: 10px;\n    }\n  </style>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n  <p>This is a <strong>preview</strong> of your HTML code.</p>\n  <p>Edit the HTML in the left panel to see changes in real-time.</p>\n  <ul>\n    <li>List item 1</li>\n    <li>List item 2</li>\n    <li>List item 3</li>\n  </ul>\n</body>\n</html>"
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef(null);

  // Update the iframe content when input changes or fullscreen state changes
  useEffect(() => {
    updateIframeContent();
  }, [input, isFullscreen]);

  const updateIframeContent = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

      // Clear the document and write the new HTML
      iframeDoc.open();
      iframeDoc.write(input);
      iframeDoc.close();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
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
                <h2 className="text-2xl font-semibold text-gray-900">
                  Preview
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
              <iframe
                ref={iframeRef}
                title="HTML Preview"
                className="w-full h-[calc(100vh-120px)] border border-gray-300 rounded-md"
                sandbox="allow-same-origin"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">HTML Preview</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                HTML Input
              </label>
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
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-[calc(100vh-280px)] px-3 py-2 border border-gray-300 rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              placeholder="Enter HTML code"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Preview
              </label>
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
            <iframe
              ref={iframeRef}
              title="HTML Preview"
              className="w-full h-[calc(100vh-280px)] border border-gray-300 rounded-md"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </div>
    </>
  );
}
