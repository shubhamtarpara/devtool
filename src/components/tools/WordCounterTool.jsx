"use client";

import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function WordCounterTool() {
  const [input, setInput] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getStats = (text) => {
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
    const paragraphs = text.trim() ? text.trim().split(/\n\s*\n/).length : 0;
    const sentences = text.trim() ? text.trim().split(/[.!?]+\s+/).length : 0;
    const alphanumeric = (text.match(/[a-zA-Z0-9]/g) || []).length;
    const spaces = (text.match(/\s/g) || []).length;

    return {
      chars,
      words,
      lines,
      paragraphs,
      sentences,
      alphanumeric,
      spaces,
    };
  };

  const stats = getStats(input);

  const output = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-indigo-600">
            {stats.chars}
          </div>
          <div className="text-sm text-gray-600">Characters</div>
        </div>
        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-indigo-600">
            {stats.words}
          </div>
          <div className="text-sm text-gray-600">Words</div>
        </div>
        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-indigo-600">
            {stats.lines}
          </div>
          <div className="text-sm text-gray-600">Lines</div>
        </div>
        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-indigo-600">
            {stats.paragraphs}
          </div>
          <div className="text-sm text-gray-600">Paragraphs</div>
        </div>
        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-indigo-600">
            {stats.sentences}
          </div>
          <div className="text-sm text-gray-600">Sentences</div>
        </div>
        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-indigo-600">
            {stats.alphanumeric}
          </div>
          <div className="text-sm text-gray-600">Alphanumeric</div>
        </div>
      </div>
      <div className="text-sm text-gray-500">
        Additional Info:
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Spaces: {stats.spaces}</li>
          <li>
            Non-alphanumeric: {stats.chars - stats.alphanumeric - stats.spaces}
          </li>
        </ul>
      </div>
    </div>
  );

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
                  Statistics
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
              {output}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Word Counter
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Input Text
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              placeholder="Enter or paste your text here"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Statistics
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
            {output}
          </div>
        </div>
      </div>
    </>
  );
}
