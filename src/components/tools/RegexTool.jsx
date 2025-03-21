"use client";

import { useState, useEffect, useRef } from "react";
import {
  Maximize2,
  Minimize2,
  Copy,
  Info,
  Save,
  Download,
  Upload,
  Trash2,
  Plus,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function RegexTool() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [output, setOutput] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState("");
  const [matches, setMatches] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [patternName, setPatternName] = useState("");
  const [savedPatterns, setSavedPatterns] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("savedPatterns");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [quickPatterns, setQuickPatterns] = useState([
    {
      name: "Email",
      pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
    },
    {
      name: "URL",
      pattern: "https?:\\/\\/[\\w\\.-]+\\.[a-z]{2,}[\\/\\w\\.-]*",
    },
    { name: "IP Address", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b" },
    { name: "Date (YYYY-MM-DD)", pattern: "\\d{4}-\\d{2}-\\d{2}" },
    { name: "Sticky", pattern: "(y)" },
  ]);
  const outputRef = useRef(null);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const applyQuickPattern = (patternText) => {
    setPattern(patternText);
  };

  const savePattern = () => {
    if (!patternName || !pattern) return;

    const newPattern = {
      id: Date.now().toString(),
      name: patternName,
      pattern,
      flags,
      testString,
    };

    const updatedPatterns = [...savedPatterns, newPattern];
    setSavedPatterns(updatedPatterns);
    localStorage.setItem("savedPatterns", JSON.stringify(updatedPatterns));
    setShowSaveDialog(false);
    setPatternName("");
  };

  const loadPattern = (savedPattern) => {
    setPattern(savedPattern.pattern);
    setFlags(savedPattern.flags);
    if (savedPattern.testString) {
      setTestString(savedPattern.testString);
    }
  };

  const deletePattern = (patternId) => {
    const updatedPatterns = savedPatterns.filter((p) => p.id !== patternId);
    setSavedPatterns(updatedPatterns);
    localStorage.setItem("savedPatterns", JSON.stringify(updatedPatterns));
  };

  const regexCheatSheet = [
    {
      category: "Character Classes",
      items: [
        { symbol: "\\d", description: "Digit" },
        { symbol: "\\w", description: "Word character" },
        { symbol: "\\s", description: "Whitespace" },
        { symbol: "[a-z]", description: "Range" },
        { symbol: "[^abc]", description: "Negation" },
      ],
    },
    {
      category: "Anchors",
      items: [
        { symbol: "^", description: "Start of string" },
        { symbol: "$", description: "End of string" },
        { symbol: "\\b", description: "Word boundary" },
      ],
    },
    {
      category: "Quantifiers",
      items: [
        { symbol: "*", description: "0 or more" },
        { symbol: "+", description: "1 or more" },
        { symbol: "?", description: "0 or 1" },
        { symbol: "{n}", description: "Exactly n" },
        { symbol: "{n,}", description: "n or more" },
        { symbol: "{n,m}", description: "Between n and m" },
      ],
    },
  ];

  useEffect(() => {
    if (!pattern || !testString) {
      setOutput("");
      setError("");
      setMatches([]);
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const foundMatches = [];
      const parts = [];
      let lastIndex = 0;
      let match;
      let matchCount = 0;
      const maxMatches = 1000; // Prevent infinite loops

      if (flags.includes("g")) {
        while (
          (match = regex.exec(testString)) !== null &&
          matchCount < maxMatches
        ) {
          matchCount++;
          foundMatches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
            length: match[0].length,
          });

          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          foundMatches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
            length: match[0].length,
          });
        }
      }

      foundMatches.forEach((match, i) => {
        if (match.index > lastIndex) {
          parts.push(
            `<span class="text-gray-600">${testString.slice(
              lastIndex,
              match.index
            )}</span>`
          );
        }
        parts.push(
          `<span class="bg-green-200 text-green-900 font-semibold px-0.5 rounded">${match.text}</span>`
        );
        lastIndex = match.index + match.length;
      });

      if (lastIndex < testString.length) {
        parts.push(
          `<span class="text-gray-600">${testString.slice(lastIndex)}</span>`
        );
      }

      setMatches(foundMatches);

      const matchesInfo = foundMatches
        .map(
          (match, i) =>
            `<div class="p-2 border-b border-gray-200 hover:bg-gray-50">
              <div class="flex justify-between">
                <span class="font-medium">Match ${i + 1}</span>
                <button class="text-gray-500 hover:text-gray-700" onclick="copyMatch(${i})">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
              </div>
              <div class="font-mono text-sm bg-gray-50 p-1 mt-1 rounded">${
                match.text
              }</div>
              <div class="text-xs text-gray-500 mt-1">Index: ${
                match.index
              }, Length: ${match.length}</div>
              ${
                match.groups.length
                  ? `<div class="mt-2">
                  <div class="text-xs font-medium text-gray-700">Capture Groups:</div>
                  <div class="grid grid-cols-2 gap-1 mt-1">
                    ${match.groups
                      .map(
                        (group, j) =>
                          `<div class="text-xs bg-gray-50 p-1 rounded">
                        <span class="text-gray-500">Group ${j + 1}:</span> ${
                            group || "<empty>"
                          }
                      </div>`
                      )
                      .join("")}
                  </div>
                </div>`
                  : ""
              }
            </div>`
        )
        .join("");

      setOutput(
        `<div class="space-y-4">
          <div class="font-mono break-words whitespace-pre-wrap">${
            parts.join("") || testString
          }</div>
          ${
            foundMatches.length
              ? `<div class="mt-4 border rounded-md overflow-hidden">
              <div class="bg-gray-50 p-2 border-b flex justify-between items-center">
                <span class="font-medium">${foundMatches.length} matches found</span>
              </div>
              <div class="max-h-64 overflow-y-auto">${matchesInfo}</div>
            </div>`
              : `<div class="text-sm text-gray-500 p-2 bg-gray-50 rounded-md">No matches found</div>`
          }
        </div>`
      );
      setError("");
    } catch (err) {
      setError(err.message);
      setOutput("");
      setMatches([]);
    }
  }, [pattern, flags, testString]);

  // Add script to handle copy button clicks
  useEffect(() => {
    if (outputRef.current && matches.length > 0) {
      window.copyMatch = (index) => {
        if (matches[index]) {
          copyToClipboard(matches[index].text);
        }
      };
    }
    return () => {
      window.copyMatch = undefined;
    };
  }, [matches, outputRef]);

  const flagOptions = [
    {
      value: "g",
      label: "Global",
      description:
        "Find all matches rather than stopping after the first match",
    },
    {
      value: "i",
      label: "Case Insensitive",
      description: "Make the regex case-insensitive",
    },
    {
      value: "m",
      label: "Multiline",
      description:
        "^ and $ match start/end of line in addition to start/end of string",
    },
    {
      value: "s",
      label: "Dot All",
      description: ". matches newline characters as well",
    },
    {
      value: "u",
      label: "Unicode",
      description: "Treat pattern as a sequence of Unicode code points",
    },
    {
      value: "y",
      label: "Sticky",
      description:
        "Matches only from the index indicated by lastIndex property",
    },
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
              <div
                ref={outputRef}
                dangerouslySetInnerHTML={{ __html: output }}
                className="w-full h-[calc(100vh-120px)] px-3 py-2 bg-gray-50 border border-gray-300 rounded-md overflow-auto transition-all duration-300"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Regular Expression Tester
        </h2>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Pattern
              </label>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center text-xs text-gray-500 hover:text-gray-700"
              >
                <Info className="h-3 w-3 mr-1" />
                {showExplanation ? "Hide Help" : "Show Help"}
              </motion.button>
            </div>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              placeholder="Enter regex pattern"
            />
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 overflow-hidden"
              >
                <h3 className="font-medium mb-2">Regex Quick Reference</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-mono font-bold">.</span> - Any
                    character
                  </div>
                  <div>
                    <span className="font-mono font-bold">\d</span> - Digit
                  </div>
                  <div>
                    <span className="font-mono font-bold">\w</span> - Word
                    character
                  </div>
                  <div>
                    <span className="font-mono font-bold">\s</span> - Whitespace
                  </div>
                  <div>
                    <span className="font-mono font-bold">[abc]</span> -
                    Character class
                  </div>
                  <div>
                    <span className="font-mono font-bold">^</span> - Start of
                    string
                  </div>
                  <div>
                    <span className="font-mono font-bold">$</span> - End of
                    string
                  </div>
                  <div>
                    <span className="font-mono font-bold">*</span> - 0 or more
                  </div>
                  <div>
                    <span className="font-mono font-bold">+</span> - 1 or more
                  </div>
                  <div>
                    <span className="font-mono font-bold">?</span> - 0 or 1
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showCheatSheet && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-blue-50 p-4 rounded-md text-sm text-blue-800 overflow-hidden mt-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">
                    Comprehensive Regex Cheat Sheet
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCheatSheet(false)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </motion.button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {regexCheatSheet.map((category) => (
                    <div
                      key={category.category}
                      className="border-b border-blue-100 pb-3"
                    >
                      <h4 className="font-medium text-blue-700 mb-2">
                        {category.category}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {category.items.map((item) => (
                          <div key={item.symbol} className="flex">
                            <span
                              className="font-mono font-bold bg-blue-100 px-1 rounded mr-2 cursor-pointer hover:bg-blue-200"
                              onClick={() => {
                                const newPattern = pattern + item.symbol;
                                setPattern(newPattern);
                              }}
                              title="Click to append to pattern"
                            >
                              {item.symbol}
                            </span>
                            <span>{item.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test String
            </label>
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              placeholder="Enter text to test against the regex pattern"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Flags
            </label>
            <div className="flex flex-wrap gap-2">
              {flagOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center"
                  title={option.description}
                >
                  <input
                    type="checkbox"
                    id={`flag-${option.value}`}
                    checked={flags.includes(option.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFlags(flags + option.value);
                      } else {
                        setFlags(flags.replace(option.value, ""));
                      }
                    }}
                    className="mr-1"
                  />
                  <label
                    htmlFor={`flag-${option.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {option.label} ({option.value})
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickPatterns.map((qp) => (
              <motion.button
                key={qp.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => applyQuickPattern(qp.pattern)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-all duration-300"
              >
                {qp.name}
              </motion.button>
            ))}
          </div>

          {savedPatterns.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Saved Patterns
              </h3>
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-1">
                {savedPatterns.map((sp) => (
                  <div
                    key={sp.id}
                    className="flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-all duration-300"
                  >
                    <div className="flex-1 truncate">
                      <div className="font-medium text-sm">{sp.name}</div>
                      <div className="text-xs text-gray-500 font-mono truncate">
                        {sp.pattern}
                      </div>
                    </div>
                    <div className="flex space-x-1 ml-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => loadPattern(sp)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Load pattern"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deletePattern(sp.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete pattern"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </motion.button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {showSaveDialog && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Save Pattern
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pattern Name
                      </label>
                      <input
                        type="text"
                        value={patternName}
                        onChange={(e) => setPatternName(e.target.value)}
                        placeholder="Enter a name for this pattern"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        Pattern
                      </div>
                      <div className="font-mono text-sm break-all">
                        {pattern}
                      </div>

                      <div className="text-sm font-medium text-gray-700 mt-2 mb-1">
                        Flags
                      </div>
                      <div className="font-mono text-sm">{flags}</div>

                      {testString && (
                        <>
                          <div className="text-sm font-medium text-gray-700 mt-2 mb-1">
                            Test String
                          </div>
                          <div className="font-mono text-sm truncate">
                            {testString.length > 50
                              ? `${testString.substring(0, 50)}...`
                              : testString}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowSaveDialog(false)}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-300"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={savePattern}
                        className="px-4 py-2 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition-all duration-300"
                      >
                        Save
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

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
              <div
                dangerouslySetInnerHTML={{ __html: output }}
                className="w-full min-h-[12rem] px-3 py-2 bg-gray-50 border border-gray-300 rounded-md overflow-auto transition-all duration-300"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
