"use client";

import { useState, useEffect } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function TimestampTool() {
  const [input, setInput] = useState("");
  const [outputs, setOutputs] = useState({
    unix: "",
    local: "",
    dayOfYear: "",
    weekOfYear: "",
    isLeapYear: false,
    relative: "",
    otherFormats: {
      iso: "",
      rfc: "",
      utc: "",
      short: "",
      monthDay: "",
      time: "",
    },
  });
  const [mode, setMode] = useState("toTimestamp");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (input) handleConvert();
  }, [input, mode]);

  const handleConvert = () => {
    try {
      let timestamp;
      if (mode === "toTimestamp") {
        const date = new Date(input);
        if (isNaN(date.getTime())) throw new Error("Invalid date");
        updateOutputs(date);
      } else {
        // Support for mathematical expressions
        const expr = input.replace(/[^-()+\d/*\s.]/g, "");
        timestamp = expr ? eval(expr) : parseInt(input);
        if (isNaN(timestamp)) throw new Error("Invalid timestamp");
        const date = new Date(timestamp * 1000);
        updateOutputs(date);
      }
    } catch (error) {
      setOutputs({
        unix: "Invalid input",
        local: "Invalid input",
        dayOfYear: "Invalid input",
        weekOfYear: "Invalid input",
        isLeapYear: false,
        relative: "Invalid input",
        otherFormats: {
          iso: "Invalid input",
          rfc: "Invalid input",
          utc: "Invalid input",
          short: "Invalid input",
          monthDay: "Invalid input",
          time: "Invalid input",
        },
      });
    }
  };

  const updateOutputs = (date) => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const weekOfYear = Math.ceil(dayOfYear / 7);
    const isLeapYear = new Date(date.getFullYear(), 1, 29).getMonth() === 1;
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / oneDay);
    const relative = diffDays === 0 ? "now" : `${diffDays} days ago`;

    setOutputs({
      unix: Math.floor(date.getTime() / 1000).toString(),
      local: date.toLocaleString(),
      dayOfYear: dayOfYear.toString(),
      weekOfYear: weekOfYear.toString(),
      isLeapYear,
      relative,
      otherFormats: {
        iso: date.toISOString(),
        rfc: date.toUTCString(),
        utc: date.toUTCString(),
        short: date.toLocaleDateString(),
        monthDay: date.toLocaleString("en-US", {
          month: "long",
          day: "numeric",
        }),
        time: date.toLocaleTimeString(),
      },
    });
  };

  const handleNowClick = () => {
    if (mode === "toTimestamp") {
      setInput(new Date().toISOString());
    } else {
      setInput(new Date().getTime().toString());
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
              <div className="space-y-4">
                {Object.entries(outputs).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 capitalize mb-2">
                      {key} Format
                    </label>
                    <textarea
                      value={value}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Unix Time Converter
          </h2>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode("toTimestamp")}
              className={`px-4 py-2 text-sm rounded-md transition-all duration-300 ${
                mode === "toTimestamp"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Date to Timestamp
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode("toDate")}
              className={`px-4 py-2 text-sm rounded-md transition-all duration-300 ${
                mode === "toDate"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Timestamp to Date
            </motion.button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Current Time:</span>
              <span className="text-sm font-mono">
                {currentTime.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">
                Current Unix Timestamp:
              </span>
              <span className="text-sm font-mono">{currentTime.getTime()}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Input
              </label>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNowClick}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                Use Current Time
              </motion.button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              placeholder={
                mode === "toTimestamp"
                  ? "Enter date (e.g. 2023-01-01 or ISO string)"
                  : "Enter Unix timestamp (e.g. 1672531200000)"
              }
            />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unix time (seconds since epoch)
                </label>
                <input
                  type="text"
                  value={outputs.unix}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Local
                </label>
                <input
                  type="text"
                  value={outputs.local}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Day of year
                </label>
                <input
                  type="text"
                  value={outputs.dayOfYear}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Week of year
                </label>
                <input
                  type="text"
                  value={outputs.weekOfYear}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Is leap year?
                </label>
                <input
                  type="text"
                  value={outputs.isLeapYear.toString()}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relative
              </label>
              <input
                type="text"
                value={outputs.relative}
                readOnly
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Other formats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(outputs.otherFormats).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {key}
                    </label>
                    <input
                      type="text"
                      value={value}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
