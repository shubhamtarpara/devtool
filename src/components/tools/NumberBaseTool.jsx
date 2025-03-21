"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function NumberBaseTool() {
  const [input, setInput] = useState("");
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(16);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const bases = [
    { value: 2, label: "Binary" },
    { value: 8, label: "Octal" },
    { value: 10, label: "Decimal" },
    { value: 16, label: "Hexadecimal" },
  ];

  const convert = () => {
    try {
      if (!input) {
        setOutput("");
        setError("");
        return;
      }

      const decimal = parseInt(input, fromBase);
      if (isNaN(decimal)) {
        throw new Error("Invalid number for selected base");
      }

      setOutput(decimal.toString(toBase).toUpperCase());
      setError("");
    } catch (err) {
      setError("Invalid number for selected base");
      setOutput("");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Number Base Converter
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Input Number
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
            placeholder={`Enter a ${bases
              .find((b) => b.value === fromBase)
              ?.label.toLowerCase()} number`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Base
            </label>
            <div className="grid grid-cols-2 gap-2">
              {bases.map(({ value, label }) => (
                <motion.button
                  key={`from-${value}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setFromBase(value);
                    setError("");
                  }}
                  className={`py-2 px-4 rounded-md transition-all duration-300 ${
                    fromBase === value
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Base
            </label>
            <div className="grid grid-cols-2 gap-2">
              {bases.map(({ value, label }) => (
                <motion.button
                  key={`to-${value}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setToBase(value);
                    setError("");
                  }}
                  className={`py-2 px-4 rounded-md transition-all duration-300 ${
                    toBase === value
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={convert}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-all duration-300"
        >
          Convert
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

        {output && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Result
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                readOnly
                value={output}
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono transition-all duration-300"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigator.clipboard.writeText(output)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all duration-300"
              >
                Copy
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
