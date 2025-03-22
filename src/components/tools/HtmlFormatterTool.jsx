"use client";

import { useState } from "react";
import { Maximize2, Minimize2, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { html as beautifyHtml } from "js-beautify";

export function HtmlFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(2);
  const [wrapLineLength, setWrapLineLength] = useState(80);
  const [preserveNewlines, setPreserveNewlines] = useState(true);

  const handleFormat = () => {
    try {
      const options = {
        indent_size: indentSize,
        wrap_line_length: wrapLineLength,
        preserve_newlines: preserveNewlines,
        indent_inner_html: true,
        extra_liners: [],
        unformatted: ["code", "pre", "textarea"],
        indent_scripts: "keep",
        end_with_newline: true,
      };

      const formatted = beautifyHtml(input, options);
      setOutput(formatted);
    } catch (error) {
      setOutput("Error formatting HTML: " + error.message);
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
            HTML Formatter
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HTML Input
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 font-mono"
              placeholder="Enter HTML to format"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Indent Size
              </label>
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wrap Line Length
              </label>
              <select
                value={wrapLineLength}
                onChange={(e) => setWrapLineLength(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              >
                <option value={0}>No wrapping</option>
                <option value={80}>80 characters</option>
                <option value={120}>120 characters</option>
                <option value={160}>160 characters</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="preserveNewlines"
                checked={preserveNewlines}
                onChange={(e) => setPreserveNewlines(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="preserveNewlines"
                className="ml-2 block text-sm text-gray-700"
              >
                Preserve Newlines
              </label>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFormat}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-all duration-300"
          >
            Format HTML
          </motion.button>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Formatted HTML
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
