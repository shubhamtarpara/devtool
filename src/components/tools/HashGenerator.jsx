"use client";

import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState({});
  const [isFullscreen, setIsFullscreen] = useState(false);

  const generateHash = async () => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    const hashTypes = ["SHA-256", "SHA-384", "SHA-512"];
    const newHashes = {};

    for (const hashType of hashTypes) {
      const hashBuffer = await crypto.subtle.digest(hashType, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      newHashes[hashType] = hashHex;
    }

    setHashes(newHashes);
  };

  return (
    <>
      <AnimatePresence>
        {isFullscreen && Object.keys(hashes).length > 0 && (
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
                  Generated Hashes
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {Object.entries(hashes).map(([type, hash], index) => (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 p-4 rounded-md transition-all duration-300"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {type}
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={hash}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md font-mono text-sm transition-all duration-300"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Hash Generator
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
              placeholder="Enter text to hash"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateHash}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-all duration-300"
          >
            Generate Hashes
          </motion.button>

          {Object.keys(hashes).length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Generated Hashes
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
              {Object.entries(hashes).map(([type, hash], index) => (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="mb-4 transition-all duration-300"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {type}
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={hash}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono text-sm transition-all duration-300"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
