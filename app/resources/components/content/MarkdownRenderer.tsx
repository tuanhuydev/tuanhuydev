"use client";

import { useTheme } from "@resources/hooks/useTheme";
import Image from "next/image";
import Markdown, { Components } from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { darcula, docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export type MarkdownRendererProps = {
  content: string;
  className?: string;
  components?: Components;
};

const baseComponents = (darkMode: boolean): Components => ({
  code(props) {
    const { children, className, node, ...rest } = props as any;
    const match = /language-(\w+)/.exec(className as string);
    if (!match) {
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
    const lang = match[1] as string;
    return (
      <SyntaxHighlighter
        {...rest}
        PreTag="div"
        showLineNumbers
        language={lang}
        className="rounded-lg shadow-sm my-4"
        ref={null as any}
        style={darkMode ? darcula : docco}>
        {String(children ?? "")}
      </SyntaxHighlighter>
    );
  },
  pre({ node, ...rest }) {
    return <pre {...rest} className="rounded-lg overflow-auto text-xs sm:text-sm my-3 sm:my-4" />;
  },
  h1({ node, ...rest }) {
    return (
      <h1
        {...rest}
        className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-5 sm:mt-6 mb-2.5 sm:mb-3 pb-2 border-b-2 border-gray-200 dark:border-gray-700 leading-tight"
      />
    );
  },
  h2({ node, ...rest }) {
    return (
      <h2
        {...rest}
        className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mt-4 sm:mt-5 mb-2 pb-1.5 border-b border-gray-200 dark:border-gray-700 leading-tight"
      />
    );
  },
  h3({ node, ...rest }) {
    return (
      <h3
        {...rest}
        className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white mt-3 sm:mt-4 mb-1.5 sm:mb-2 leading-snug"
      />
    );
  },
  h4({ node, ...rest }) {
    return (
      <h4
        {...rest}
        className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mt-3 mb-1.5 leading-snug"
      />
    );
  },
  h5({ node, ...rest }) {
    return (
      <h5
        {...rest}
        className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mt-2 sm:mt-3 mb-1 sm:mb-1.5 leading-normal"
      />
    );
  },
  h6({ node, ...rest }) {
    return (
      <h6
        {...rest}
        className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mt-2 mb-1 leading-normal"
      />
    );
  },
  p({ node, ...rest }) {
    return <p {...rest} className="my-2 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300" />;
  },
  ul({ node, ...rest }) {
    return (
      <ul
        {...rest}
        className="list-disc pl-4 sm:pl-5 my-2 space-y-1 text-sm sm:text-base text-gray-700 dark:text-gray-300"
      />
    );
  },
  ol({ node, ...rest }) {
    return (
      <ol
        {...rest}
        className="list-decimal pl-4 sm:pl-5 my-2 space-y-1 text-sm sm:text-base text-gray-700 dark:text-gray-300"
      />
    );
  },
  li({ node, ...rest }) {
    return <li {...rest} className="leading-relaxed pl-0.5 sm:pl-1" />;
  },
  a({ node, ...rest }) {
    return (
      <a
        {...rest}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-2 transition-colors"
      />
    );
  },
  blockquote({ node, ...rest }) {
    return (
      <blockquote
        {...rest}
        className="border-l-4 border-blue-500 dark:border-blue-400 pl-3 sm:pl-4 py-1.5 sm:py-2 my-2 sm:my-3 bg-blue-50 dark:bg-slate-800/50 rounded-r-md italic text-sm sm:text-base text-gray-700 dark:text-gray-300"
      />
    );
  },
  table({ node, ...rest }) {
    return (
      <div className="my-3 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
        <table {...rest} className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-xs sm:text-sm" />
      </div>
    );
  },
  thead({ node, ...rest }) {
    return <thead {...rest} className="bg-slate-50 dark:bg-slate-800" />;
  },
  tbody({ node, ...rest }) {
    return <tbody {...rest} className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700" />;
  },
  tr({ node, ...rest }) {
    return <tr {...rest} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" />;
  },
  th({ node, ...rest }) {
    return (
      <th
        {...rest}
        className="px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-white"
      />
    );
  },
  td({ node, ...rest }) {
    return <td {...rest} className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300" />;
  },
  hr({ node, ...rest }) {
    return <hr {...rest} className="my-4 border-t border-gray-200 dark:border-gray-700" />;
  },
  strong({ node, ...rest }) {
    return <strong {...rest} className="font-semibold text-gray-900 dark:text-white" />;
  },
  em({ node, ...rest }) {
    return <em {...rest} className="italic text-gray-700 dark:text-gray-300" />;
  },
  del({ node, ...rest }) {
    return <del {...rest} className="line-through text-gray-500 dark:text-gray-400" />;
  },
  img({ src, alt }) {
    return (
      <div className="w-full max-w-full h-40 sm:h-48 md:h-64 relative my-2 sm:my-3 rounded-lg overflow-hidden shadow-md">
        <Image src={src as string} alt={(alt as string) || "image"} fill className="object-contain" />
      </div>
    );
  },
});

export default function MarkdownRenderer({ content, className, components }: MarkdownRendererProps) {
  const { darkMode } = useTheme();

  return (
    <div className={className}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{ ...baseComponents(darkMode), ...(components || {}) }}>
        {content}
      </Markdown>
    </div>
  );
}
