"use client";

import { useState, useEffect } from "react";
import {
  v1 as uuidv1,
  v4 as uuidv4,
  v5 as uuidv5,
  v3 as uuidv3,
  NIL as NIL_UUID,
} from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Maximize2, Minimize2, RefreshCw } from "lucide-react";

export function UuidTool() {
  const [uuids, setUuids] = useState([]);
  const [count, setCount] = useState(1);
  const [version, setVersion] = useState("v4");
  const [format, setFormat] = useState("default");
  const [namespace, setNamespace] = useState(NIL_UUID);
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [allUuids, setAllUuids] = useState("");
  const [showCopiedAll, setShowCopiedAll] = useState(false);

  useEffect(() => {
    if (uuids.length > 0) {
      setAllUuids(uuids.join("\n"));
    }
  }, [uuids]);

  const generateUuids = () => {
    let newUuids = [];

    for (let i = 0; i < count; i++) {
      let uuid;
      switch (version) {
        case "v1":
          uuid = uuidv1();
          break;
        case "v3":
          uuid = uuidv3(name || "example.com", namespace);
          break;
        case "v5":
          uuid = uuidv5(name || "example.com", namespace);
          break;
        case "nil":
          uuid = NIL_UUID;
          break;
        case "v4":
        default:
          uuid = uuidv4();
          break;
      }

      // Format the UUID based on the selected format
      if (format === "no-hyphens") {
        uuid = uuid.replace(/-/g, "");
      } else if (format === "uppercase") {
        uuid = uuid.toUpperCase();
      } else if (format === "uppercase-no-hyphens") {
        uuid = uuid.replace(/-/g, "").toUpperCase();
      } else if (format === "braces") {
        uuid = `{${uuid}}`;
      } else if (format === "braces-uppercase") {
        uuid = `{${uuid.toUpperCase()}}`;
      }

      newUuids.push(uuid);
    }

    setUuids(newUuids);
  };

  const copyToClipboard = async (text, index) => {
    await navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAllToClipboard = async () => {
    await navigator.clipboard.writeText(allUuids);
    setShowCopiedAll(true);
    setTimeout(() => setShowCopiedAll(false), 2000);
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
                  Generated UUIDs
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
              <div className="flex justify-end mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyAllToClipboard}
                  className="px-4 py-2 flex items-center space-x-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all duration-300"
                >
                  {showCopiedAll ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy All</span>
                    </>
                  )}
                </motion.button>
              </div>
              <textarea
                value={allUuids}
                readOnly
                className="w-full h-[calc(100vh-200px)] px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono text-sm transition-all duration-300"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          UUID Generator
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UUID Version
              </label>
              <select
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              >
                <option value="v4">Version 4 (Random)</option>
                <option value="v1">Version 1 (Time-based)</option>
                <option value="v3">Version 3 (MD5 hash)</option>
                <option value="v5">Version 5 (SHA-1 hash)</option>
                <option value="nil">Nil UUID</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              >
                <option value="default">
                  Default (lowercase with hyphens)
                </option>
                <option value="uppercase">Uppercase with hyphens</option>
                <option value="no-hyphens">No hyphens</option>
                <option value="uppercase-no-hyphens">
                  Uppercase without hyphens
                </option>
                <option value="braces">With braces</option>
                <option value="braces-uppercase">
                  With braces (uppercase)
                </option>
              </select>
            </div>
          </div>

          {(version === "v3" || version === "v5") && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Namespace UUID
                </label>
                <input
                  type="text"
                  value={namespace}
                  onChange={(e) => setNamespace(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  placeholder="Enter namespace UUID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  placeholder="Enter name"
                />
              </div>
            </div>
          )}

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
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Generate UUIDs</span>
          </motion.button>

          {uuids.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700">
                  Generated UUIDs
                </h3>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyAllToClipboard}
                    className="px-3 py-1 flex items-center space-x-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all duration-300"
                  >
                    {showCopiedAll ? (
                      <>
                        <Check className="h-3 w-3 text-green-500" />
                        <span className="text-xs">Copied All</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span className="text-xs">Copy All</span>
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsFullscreen(true)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all duration-300"
                    title="View fullscreen"
                  >
                    <Maximize2 className="h-3 w-3" />
                  </motion.button>
                </div>
              </div>

              <div className="space-y-2 mt-2">
                {uuids.map((uuid, index) => (
                  <motion.div
                    key={uuid}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
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
                      onClick={() => copyToClipboard(uuid, index)}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all duration-300 flex items-center space-x-1"
                    >
                      {copied === index ? (
                        <>
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
