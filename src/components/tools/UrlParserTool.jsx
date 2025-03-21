"use client";

import { useState, useEffect } from "react";
import { Maximize2, Minimize2, Copy, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function UrlParserTool() {
  const [input, setInput] = useState("");
  const [parsedUrl, setParsedUrl] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [copyStatus, setCopyStatus] = useState({});

  useEffect(() => {
    const parseUrl = () => {
      if (!input.trim()) {
        setParsedUrl(null);
        return;
      }

      try {
        // Add protocol if missing
        let urlString = input;
        if (!/^[a-zA-Z]+:\/\//.test(urlString)) {
          urlString = "http://" + urlString;
        }

        const url = new URL(urlString);
        setParsedUrl({
          protocol: url.protocol,
          hostname: url.hostname,
          port: url.port || "(default)",
          pathname: url.pathname,
          search: url.search,
          searchParams: Object.fromEntries(url.searchParams.entries()),
          hash: url.hash,
          origin: url.origin,
          href: url.href,
        });
      } catch (error) {
        setParsedUrl({
          error: "Invalid URL: " + error.message,
          suggestion: !input.includes("://")
            ? "Try adding http:// or https:// prefix"
            : "",
        });
      }
    };

    const debounceTimer = setTimeout(parseUrl, 500);
    return () => clearTimeout(debounceTimer);
  }, [input]);

  const handleCopy = (key, value) => {
    navigator.clipboard.writeText(value);
    setCopyStatus({ [key]: true });
    setTimeout(() => setCopyStatus({}), 2000);
  };

  const tooltips = {
    protocol: "The protocol scheme of the URL (e.g. http:// or https://)",
    hostname: "The domain name of the URL",
    port: "The port number (if specified)",
    pathname: "The path after the domain",
    search: "The query string including ?",
    hash: "The fragment identifier including #",
    origin: "The combination of protocol, hostname, and port",
    href: "The complete URL",
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
                  Parsed URL
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
              <textarea
                value={JSON.stringify(parsedUrl, null, 2)}
                readOnly
                className="w-full h-[calc(100vh-120px)] px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono transition-all duration-300"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">URL Parser</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              placeholder="Enter URL to parse (e.g., https://example.com/path?query=value#hash)"
            />
          </div>

          {parsedUrl?.error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700">{parsedUrl.error}</p>
              {parsedUrl.suggestion && (
                <p className="text-red-600 mt-2 text-sm">
                  {parsedUrl.suggestion}
                </p>
              )}
            </div>
          ) : (
            parsedUrl && (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {Object.entries(parsedUrl).map(([key, value]) => {
                  if (key === "searchParams") {
                    if (Object.keys(value).length === 0) return null;
                    return (
                      <div key={key} className="border-t border-gray-200 p-4">
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Query Parameters
                          </span>
                          {activeTooltip === key && (
                            <div className="ml-2 p-2 bg-gray-800 text-white text-xs rounded absolute">
                              {tooltips[key]}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          {Object.entries(value).map(
                            ([paramKey, paramValue]) => (
                              <div
                                key={paramKey}
                                className="flex items-center justify-between bg-gray-50 p-2 rounded"
                              >
                                <span className="text-sm text-gray-600">
                                  {paramKey}:{" "}
                                  <span className="font-mono">
                                    {paramValue}
                                  </span>
                                </span>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() =>
                                    handleCopy(`${key}-${paramKey}`, paramValue)
                                  }
                                  className="p-1 hover:bg-gray-200 rounded"
                                >
                                  {copyStatus[`${key}-${paramKey}`] ? (
                                    <span className="text-green-600 text-xs">
                                      Copied!
                                    </span>
                                  ) : (
                                    <Copy className="h-4 w-4 text-gray-500" />
                                  )}
                                </motion.button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    );
                  }
                  if (key === "error" || !value) return null;
                  return (
                    <div
                      key={key}
                      className="border-t first:border-t-0 border-gray-200 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {key}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onMouseEnter={() => setActiveTooltip(key)}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className="p-1 hover:bg-gray-100 rounded-full"
                          >
                            <Info className="h-4 w-4 text-gray-400" />
                          </motion.button>
                          {activeTooltip === key && (
                            <div className="ml-2 p-2 bg-gray-800 text-white text-xs rounded absolute">
                              {tooltips[key]}
                            </div>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCopy(key, value)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {copyStatus[key] ? (
                            <span className="text-green-600 text-xs">
                              Copied!
                            </span>
                          ) : (
                            <Copy className="h-4 w-4 text-gray-500" />
                          )}
                        </motion.button>
                      </div>
                      <div className="mt-1">
                        <code className="text-sm bg-gray-50 px-2 py-1 rounded font-mono break-all">
                          {value}
                        </code>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}
