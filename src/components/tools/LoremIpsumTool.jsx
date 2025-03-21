'use client';

import { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation',
  'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat'
];

export function LoremIpsumTool() {
  const [paragraphs, setParagraphs] = useState(1);
  const [wordsPerParagraph, setWordsPerParagraph] = useState(50);
  const [output, setOutput] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const generateText = () => {
    const result = [];
    for (let i = 0; i < paragraphs; i++) {
      const paragraph = [];
      for (let j = 0; j < wordsPerParagraph; j++) {
        const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
        paragraph.push(j === 0 ? randomWord.charAt(0).toUpperCase() + randomWord.slice(1) : randomWord);
      }
      result.push(paragraph.join(' ') + '.');
    }
    setOutput(result.join('\n\n'));
  };

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
                <h2 className="text-2xl font-semibold text-gray-900">Generated Text</h2>
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
                className="w-full h-[calc(100vh-120px)] px-3 py-2 bg-gray-50 border border-gray-300 rounded-md transition-all duration-300"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Lorem Ipsum Generator</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paragraphs
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={paragraphs}
                onChange={(e) => setParagraphs(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Words per Paragraph
              </label>
              <input
                type="number"
                min="10"
                max="100"
                value={wordsPerParagraph}
                onChange={(e) => setWordsPerParagraph(Math.min(100, Math.max(10, parseInt(e.target.value) || 10)))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateText}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-all duration-300"
          >
            Generate Text
          </motion.button>

          {output && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Generated Text
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
                className="w-full h-48 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md transition-all duration-300"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}