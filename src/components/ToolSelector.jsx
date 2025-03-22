"use client";

import { useState } from "react";
import {
  Hash,
  Baseline as Base64,
  FileJson as Json,
  Clock,
  Link,
  Code2,
  Key,
  Fingerprint,
  Type,
  Palette,
  TextCursorInput,
  Binary,
  FileText,
  Regex,
  GitCompare,
  AlignJustify,
  ImageIcon,
  Braces,
  FileCode,
  FileSymlink,
} from "lucide-react";
import { Base64Tool } from "./tools/Base64Tool";
import { JsonTool } from "./tools/JsonTool";
import { HashGenerator } from "./tools/HashGenerator";
import { TimestampTool } from "./tools/TimestampTool";
import { UrlTool } from "./tools/UrlTool";
// import { HtmlTool } from "./tools/HtmlTool";
import { HtmlEntityTool } from "./tools/HtmlEntityTool";
import { HtmlPreviewTool } from "./tools/HtmlPreviewTool";
import { JwtTool } from "./tools/JwtTool";
import { UuidTool } from "./tools/UuidTool";
import { LoremIpsumTool } from "./tools/LoremIpsumTool";
import { ColorTool } from "./tools/ColorTool";
import { CaseTool } from "./tools/CaseTool";
import { NumberBaseTool } from "./tools/NumberBaseTool";
import { MarkdownTool } from "./tools/MarkdownTool";
import { RegexTool } from "./tools/RegexTool";
import { DiffTool } from "./tools/DiffTool";
import { WordCounterTool } from "./tools/WordCounterTool";
import { Base64ImageTool } from "./tools/Base64ImageTool";
import { BackslashEscapeTool } from "./tools/BackslashEscapeTool";
import { YamlTool } from "./tools/YamlTool";
import { JsonToYamlTool } from "./tools/JsonToYamlTool";
import { motion, AnimatePresence } from "framer-motion";
import { UrlParserTool } from "./tools/UrlParserTool";
import { HtmlFormatterTool } from "./tools/HtmlFormatterTool";

const tools = [
  {
    id: "timestamp",
    name: "Unix Time Converter",
    icon: Clock,
    component: TimestampTool,
  },
  { id: "json", name: "JSON Formatter", icon: Json, component: JsonTool },
  {
    id: "base64",
    name: "Base64 Encode/Decode",
    icon: Base64,
    component: Base64Tool,
  },
  {
    id: "base64image",
    name: "Base64 Image Converter",
    icon: ImageIcon,
    component: Base64ImageTool,
  },
  { id: "jwt", name: "JWT Decoder", icon: Key, component: JwtTool },
  {
    id: "regex",
    name: "Regex Tester",
    icon: Regex,
    component: RegexTool,
  },
  { id: "url", name: "URL Encoder/Decoder", icon: Link, component: UrlTool },
  {
    id: "url-parser",
    name: "URL Parser",
    icon: Link,
    component: UrlParserTool,
  },
  {
    id: "html-entity",
    name: "HTML Entity Encoder/Decoder",
    icon: Code2,
    component: HtmlEntityTool,
  },

  {
    id: "backslash",
    name: "Backslash Escape Tool",
    icon: Braces,
    component: BackslashEscapeTool,
  },
  {
    id: "uuid",
    name: "UUID Generator",
    icon: Fingerprint,
    component: UuidTool,
  },
  {
    id: "html-preview",
    name: "HTML Preview",
    icon: Code2,
    component: HtmlPreviewTool,
  },
  {
    id: "markdown",
    name: "Markdown Preview",
    icon: FileText,
    component: MarkdownTool,
  },
  {
    id: "diff",
    name: "Text Diff",
    icon: GitCompare,
    component: DiffTool,
  },
  { id: "yaml", name: "YAML to JSON", icon: FileSymlink, component: YamlTool },
  {
    id: "json-to-yaml",
    name: "JSON to YAML",
    icon: FileCode,
    component: JsonToYamlTool,
  },
  {
    id: "number",
    name: "Number Base Converter",
    icon: Binary,
    component: NumberBaseTool,
  },
  {
    id: "wordcount",
    name: "Word Counter",
    icon: AlignJustify,
    component: WordCounterTool,
  },

  { id: "hash", name: "Hash Generator", icon: Hash, component: HashGenerator },

  {
    id: "html-formatter",
    name: "HTML Formatter",
    icon: Code2,
    component: HtmlFormatterTool,
  },
  // {
  //   id: "html",
  //   name: "HTML Encoder/Decoder",
  //   icon: Code2,
  //   component: HtmlTool,
  // },

  {
    id: "lorem",
    name: "Lorem Ipsum Generator",
    icon: Type,
    component: LoremIpsumTool,
  },
  { id: "color", name: "Color Converter", icon: Palette, component: ColorTool },
  {
    id: "case",
    name: "Case Converter",
    icon: TextCursorInput,
    component: CaseTool,
  },
];

export function ToolSelector() {
  const [activeTool, setActiveTool] = useState("base64");
  const ActiveComponent = tools.find(
    (tool) => tool.id === activeTool
  )?.component;

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-3">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            <h2 className="text-lg font-medium text-gray-900">Tools</h2>
            <div className="mt-4 space-y-1">
              {tools.map((tool) => (
                <motion.button
                  key={tool.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTool(tool.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-all duration-300 ${
                    activeTool === tool.id
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <tool.icon className="h-5 w-5" />
                  <span className="ml-2">{tool.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-9">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow"
          >
            {ActiveComponent && <ActiveComponent />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
