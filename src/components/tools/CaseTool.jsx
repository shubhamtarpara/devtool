"use client";

import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CaseTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [caseType, setCaseType] = useState("upper");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const convertCase = () => {
    switch (caseType) {
      case "upper":
        setOutput(input.toUpperCase());
        break;
      case "lower":
        setOutput(input.toLowerCase());
        break;
      case "title":
        setOutput(
          input
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        );
        break;
      case "camel":
        setOutput(
          input
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        );
        break;
      case "snake":
        setOutput(
          input
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+/g, "_")
            .replace(/([A-Z])/g, "_$1")
            .toLowerCase()
        );
        break;
      case "kebab":
        setOutput(
          input
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+/g, "-")
            .replace(/([A-Z])/g, "-$1")
            .toLowerCase()
        );
        break;
      case "pascal":
        setOutput(
          input
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
            .replace(/^./, (str) => str.toUpperCase())
        );
        break;
    }
  };

  const cases = [
    { type: "upper", label: "UPPER CASE" },
    { type: "lower", label: "lower case" },
    { type: "title", label: "Title Case" },
    { type: "camel", label: "camelCase" },
    { type: "snake", label: "snake_case" },
    { type: "kebab", label: "kebab-case" },
    { type: "pascal", label: "PascalCase" },
  ];

  return (
    <>
      <AnimatePresence>
        {isFullscreen && output && (
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
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Case Converter
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
              placeholder="Enter text to convert"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Case
            </label>
            <div className="grid grid-cols-2 gap-2">
              {cases.map(({ type, label }) => (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCaseType(type);
                    convertCase();
                  }}
                  className={`py-2 px-4 rounded-md transition-all duration-300 ${
                    caseType === type
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </motion.button>
              ))}
            </div>
          </div>

          {output && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Output
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
              <textarea
                value={output}
                readOnly
                className="w-full h-32 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono transition-all duration-300"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
