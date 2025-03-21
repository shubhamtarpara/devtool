"use client";

import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as Diff from "diff";

export function DiffTool() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [output, setOutput] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const computeDiff = () => {
    try {
      const diff = Diff.diffLines(text1, text2);
      const formattedDiff = diff
        .map((part) => {
          const color = part.added
            ? "text-green-600"
            : part.removed
            ? "text-red-600"
            : "text-gray-600";
          const prefix = part.added ? "+ " : part.removed ? "- " : "  ";
          return `<span class="${color}">${prefix}${part.value.replace(
            /\n$/,
            ""
          )}</span>`;
        })
        .join("\n");
      setOutput(formattedDiff);
    } catch (error) {
      setOutput("Error comparing texts");
    }
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
              <div
                dangerouslySetInnerHTML={{ __html: output }}
                className="w-full h-[calc(100vh-120px)] px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono whitespace-pre overflow-auto transition-all duration-300"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Text Diff</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Text
              </label>
              <textarea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                placeholder="Enter original text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modified Text
              </label>
              <textarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                placeholder="Enter modified text"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={computeDiff}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-all duration-300"
          >
            Compare
          </motion.button>

          {output && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Differences
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
              <div
                dangerouslySetInnerHTML={{ __html: output }}
                className="w-full h-48 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono whitespace-pre overflow-auto transition-all duration-300"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
