"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";

export function UuidTool() {
  const [uuids, setUuids] = useState([]);
  const [count, setCount] = useState(1);

  const generateUuids = () => {
    const newUuids = Array.from({ length: count }, () => uuidv4());
    setUuids(newUuids);
  };

  const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        UUID Generator
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of UUIDs
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) =>
              setCount(
                Math.min(100, Math.max(1, parseInt(e.target.value) || 1))
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={generateUuids}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-all duration-300"
        >
          Generate UUIDs
        </motion.button>

        {uuids.length > 0 && (
          <div className="space-y-2">
            {uuids.map((uuid, index) => (
              <motion.div
                key={uuid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  readOnly
                  value={uuid}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono text-sm transition-all duration-300"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => copyToClipboard(uuid)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all duration-300"
                >
                  Copy
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
