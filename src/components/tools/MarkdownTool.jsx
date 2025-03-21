"use client";

import { useState, useEffect } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownTool() {
  const [input, setInput] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const defaultText = `# Markdown Preview

## Basic Syntax

### Headers
# H1
## H2
### H3

### Emphasis
*Italic* or _italic_
**Bold** or __bold__
***Bold and italic*** or ___bold and italic___

### Lists
1. First item
2. Second item
3. Third item

- Unordered item
- Another item
  - Nested item
  - Another nested item

### Links and Images
[Visit OpenAI](https://openai.com)
![Alt text](https://via.placeholder.com/150)

### Code
Inline \`code\` has \`back-ticks around\` it.

\`\`\`javascript
const greeting = 'Hello, World!';
console.log(greeting);
\`\`\`

### Tables
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

### Blockquotes
> This is a blockquote
> It can span multiple lines

### Task Lists
- [x] Completed task
- [ ] Incomplete task
`;

  useEffect(() => {
    if (!input) {
      setInput(defaultText);
    }
  }, []);

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
                  Preview
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
              <div className="prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {input}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Markdown Preview
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Markdown Input
              </label>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-[calc(100vh-280px)] px-3 py-2 border border-gray-300 rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              placeholder="Enter markdown text"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Preview
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
            <div className="w-full h-[calc(100vh-280px)] px-3 py-2 border border-gray-300 rounded-md overflow-auto bg-white">
              <div className="prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {input}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
