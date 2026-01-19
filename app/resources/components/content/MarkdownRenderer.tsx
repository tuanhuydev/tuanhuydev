"use client";

import { useTheme } from "@resources/hooks/useTheme";
import Image from "next/image";
import { JSX, memo, useMemo } from "react";
import Markdown from "react-markdown";
import type { Components } from "react-markdown";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import bash from "react-syntax-highlighter/dist/esm/languages/hljs/bash";
import css from "react-syntax-highlighter/dist/esm/languages/hljs/css";
import javascript from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import scss from "react-syntax-highlighter/dist/esm/languages/hljs/scss";
import typescript from "react-syntax-highlighter/dist/esm/languages/hljs/typescript";
import { darcula, docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

// 1. Register Languages
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("scss", scss);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("python", python);

export type MarkdownRendererProps = {
  content: string;
  className?: string;
  components?: Components;
};

const createBlock = (Tag: keyof JSX.IntrinsicElements, classes: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ({ node, ...props }: { node?: any; [key: string]: any }) => <Tag {...props} className={classes} />;
};

const createHeading = (Tag: keyof JSX.IntrinsicElements, classes: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ({ node, ...props }: { node?: any; [key: string]: any }) => <Tag {...props} className={classes} />;
};

const createBaseComponents = (darkMode: boolean): Components => ({
  // Complex components (require logic)
  code({ className, children, node: _node, ...rest }) {
    const match = /language-(\w+)/.exec(className ?? "");
    const isInline = !match;

    if (isInline) {
      return (
        <code
          {...rest}
          className={`px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 ${
            className ?? ""
          }`}>
          {children}
        </code>
      );
    }

    return (
      <SyntaxHighlighter
        PreTag="div"
        showLineNumbers
        language={match[1]}
        style={darkMode ? darcula : docco}
        className="rounded-lg shadow-sm my-4 text-sm sm:text-base">
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    );
  },

  // Simplified Definitions using Factories
  h1: createHeading(
    "h1",
    "text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-6 sm:mt-8 mb-3 sm:mb-4 pb-2 border-b-2 border-gray-200 dark:border-gray-700 leading-tight",
  ),
  h2: createHeading(
    "h2",
    "text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mt-5 sm:mt-6 mb-2 pb-1.5 border-b border-gray-200 dark:border-gray-700 leading-tight",
  ),
  h3: createHeading(
    "h3",
    "text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white mt-4 sm:mt-5 mb-2 leading-snug",
  ),
  h4: createHeading("h4", "text-sm sm:text-base font-semibold text-gray-900 dark:text-white mt-3 mb-1.5 leading-snug"),
  h5: createHeading(
    "h5",
    "text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mt-2 sm:mt-3 mb-1 sm:mb-1.5 leading-normal",
  ),
  h6: createHeading("h6", "text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mt-2 mb-1 leading-normal"),

  p: createBlock("p", "my-3 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300"),
  ul: createBlock(
    "ul",
    "list-disc pl-5 sm:pl-6 my-3 space-y-1.5 text-sm sm:text-base text-gray-700 dark:text-gray-300",
  ),
  ol: createBlock(
    "ol",
    "list-decimal pl-5 sm:pl-6 my-3 space-y-1.5 text-sm sm:text-base text-gray-700 dark:text-gray-300",
  ),
  li: createBlock("li", "leading-relaxed pl-1"),

  hr: createBlock("hr", "my-6 border-t border-gray-200 dark:border-gray-700"),
  strong: createBlock("strong", "font-semibold text-gray-900 dark:text-white"),
  em: createBlock("em", "italic text-gray-700 dark:text-gray-300"),
  del: createBlock("del", "line-through text-gray-500 dark:text-gray-400"),

  pre({ children }) {
    return <pre className="rounded-lg overflow-auto my-3 sm:my-4">{children}</pre>;
  },

  a: ({ node: _node, ...props }) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-2 transition-colors cursor-pointer"
    />
  ),

  blockquote: ({ node: _node, ...props }) => (
    <blockquote
      {...props}
      className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-2 my-4 bg-blue-50 dark:bg-slate-800/50 rounded-r-md italic text-gray-700 dark:text-gray-300 shadow-sm"
    />
  ),

  table: ({ node: _node, ...props }) => (
    <div className="my-4 w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
      <table {...props} className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-sm" />
    </div>
  ),

  thead: createBlock("thead", "bg-slate-50 dark:bg-slate-800/80"),
  tbody: createBlock("tbody", "bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700"),
  tr: createBlock("tr", "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"),

  th: ({ node: _node, ...props }) => (
    <th {...props} className="px-3 sm:px-4 py-2.5 sm:py-3 text-left font-semibold text-gray-900 dark:text-white" />
  ),

  td: ({ node: _node, ...props }) => (
    <td {...props} className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 dark:text-gray-300" />
  ),

  img: ({ src, alt }) => {
    if (!src || typeof src !== "string") return null;
    return (
      <div className="w-full relative my-4 rounded-lg overflow-hidden shadow-md bg-slate-100 dark:bg-slate-800">
        <div className="relative h-48 sm:h-64 md:h-80 w-full">
          <Image
            src={src}
            alt={alt || "content image"}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
            loading="lazy"
          />
        </div>
      </div>
    );
  },
});

const MarkdownRenderer = ({ content, className, components }: MarkdownRendererProps) => {
  const { darkMode } = useTheme();

  const memoizedComponents = useMemo(
    () => ({
      ...createBaseComponents(darkMode),
      ...components,
    }),
    [darkMode, components],
  );

  return (
    <div className={className}>
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={memoizedComponents}>
        {content}
      </Markdown>
    </div>
  );
};

export default memo(MarkdownRenderer);
