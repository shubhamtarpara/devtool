"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function ColorTool() {
  const [color, setColor] = useState("#000000");
  const [format, setFormat] = useState("hex");
  const [fillType, setFillType] = useState("background");

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const getColorString = () => {
    const rgb = hexToRgb(color);
    if (!rgb) return "";

    switch (format) {
      case "hex":
        return color.toUpperCase();
      case "rgb":
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      case "hsl":
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
      default:
        return "";
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Color Converter
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pick a Color
          </label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-12 p-1 rounded-md cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Output Format
          </label>
          <div className="flex space-x-2">
            {["hex", "rgb", "hsl"].map((f) => (
              <motion.button
                key={f}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFormat(f)}
                className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${
                  format === f
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {f.toUpperCase()}
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color Value
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              readOnly
              value={getColorString()}
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono transition-all duration-300"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigator.clipboard.writeText(getColorString())}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all duration-300"
            >
              Copy
            </motion.button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fill Type
          </label>
          <div className="flex space-x-2">
            {["background", "text"].map((type) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFillType(type)}
                className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${
                  fillType === type
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fill Preview
          </label>
          <div
            className="w-full h-24 rounded-md border border-gray-300 flex items-center justify-center text-lg"
            style={{
              backgroundColor: fillType === "background" ? color : "#ffffff",
              color: fillType === "text" ? color : "#000000",
            }}
          >
            Sample Text
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preview
          </label>
          <div
            className="w-full h-24 rounded-md border border-gray-300"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );
}
