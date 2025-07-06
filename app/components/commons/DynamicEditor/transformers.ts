"use client";

import { $createCodeNode } from "./nodes/CodeNode";
import {
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  CODE,
  HEADING,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  LINK,
  ORDERED_LIST,
  QUOTE,
  STRIKETHROUGH,
  UNORDERED_LIST,
  ElementTransformer,
  TextMatchTransformer,
  Transformer,
} from "@lexical/markdown";

// Custom code block transformer
const CODE_BLOCK: ElementTransformer = {
  dependencies: [],
  export: (node, exportChildren) => {
    if (node.getType() !== "code-block") {
      return null;
    }
    const codeNode = node as any;
    const language = codeNode.getLanguage() || "";
    const code = codeNode.getCode() || "";

    return `\`\`\`${language}\n${code}\n\`\`\``;
  },
  regExp: /^```(\w*)\s?$/,
  replace: (parentNode, children, match) => {
    const language = match[1] || "";
    const codeNode = $createCodeNode(language, "");
    parentNode.replace(codeNode);
    return true;
  },
  type: "element",
};

// Custom inline code transformer that doesn't use CodeNode
const INLINE_CODE: TextMatchTransformer = {
  dependencies: [],
  export: (node, exportChildren, exportFormat) => {
    if (node.getType() !== "text") {
      return null;
    }
    const textNode = node as any;
    if (textNode.hasFormat("code")) {
      return `\`${textNode.getTextContent()}\``;
    }
    return null;
  },
  importRegExp: /`([^`]+?)`/,
  regExp: /`([^`]+?)$/,
  replace: (textNode, match) => {
    textNode.setTextContent(match[1]);
    textNode.setFormat("code");
  },
  trigger: "`",
  type: "text-match",
};

// Export custom transformers that include our custom code block
export const CUSTOM_TRANSFORMERS: Array<Transformer> = [
  HEADING,
  QUOTE,
  // CODE_BLOCK, // Temporarily disabled
  UNORDERED_LIST,
  ORDERED_LIST,
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  STRIKETHROUGH,
  // CODE, // This handles inline code - temporarily disabled
  LINK,
];
