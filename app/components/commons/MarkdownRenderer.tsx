"use client";

import { useTheme } from "@app/_utils/useTheme";
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
    return <pre {...rest} className="rounded-lg overflow-auto text-xs sm:text-sm lg:text-base my-4" />;
  },
  h1({ node, ...rest }) {
    return (
      <h1
        {...rest}
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mt-8 mb-4 pb-3 border-b-2 border-gray-200 dark:border-gray-700 leading-tight"
      />
    );
  },
  h2({ node, ...rest }) {
    return (
      <h2
        {...rest}
        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mt-6 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700 leading-tight"
      />
    );
  },
  h3({ node, ...rest }) {
    return (
      <h3
        {...rest}
        className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white mt-5 mb-3 leading-snug"
      />
    );
  },
  h4({ node, ...rest }) {
    return (
      <h4
        {...rest}
        className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mt-4 mb-2 leading-snug"
      />
    );
  },
  h5({ node, ...rest }) {
    return (
      <h5
        {...rest}
        className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mt-3 mb-2 leading-normal"
      />
    );
  },
  h6({ node, ...rest }) {
    return (
      <h6
        {...rest}
        className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gray-700 dark:text-gray-300 mt-3 mb-2 leading-normal"
      />
    );
  },
  p({ node, ...rest }) {
    return (
      <p
        {...rest}
        className="my-3 text-sm sm:text-base md:text-lg leading-6 sm:leading-7 md:leading-8 text-gray-700 dark:text-gray-300"
      />
    );
  },
  ul({ node, ...rest }) {
    return (
      <ul
        {...rest}
        className="list-disc pl-5 sm:pl-6 md:pl-8 my-3 sm:my-4 space-y-1.5 sm:space-y-2 text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300"
      />
    );
  },
  ol({ node, ...rest }) {
    return (
      <ol
        {...rest}
        className="list-decimal pl-5 sm:pl-6 md:pl-8 my-3 sm:my-4 space-y-1.5 sm:space-y-2 text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300"
      />
    );
  },
  li({ node, ...rest }) {
    return <li {...rest} className="leading-6 sm:leading-7 md:leading-8 pl-1 sm:pl-2" />;
  },
  a({ node, ...rest }) {
    return (
      <a
        {...rest}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-2 font-medium transition-colors"
      />
    );
  },
  blockquote({ node, ...rest }) {
    return (
      <blockquote
        {...rest}
        className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-2 my-4 bg-blue-50 dark:bg-slate-800/50 rounded-r-md italic text-gray-700 dark:text-gray-300"
      />
    );
  },
  table({ node, ...rest }) {
    return (
      <div className="my-4 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
        <table {...rest} className="min-w-full divide-y divide-slate-200 dark:divide-slate-700" />
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
    return <th {...rest} className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white" />;
  },
  td({ node, ...rest }) {
    return <td {...rest} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300" />;
  },
  hr({ node, ...rest }) {
    return <hr {...rest} className="my-6 border-t-2 border-gray-200 dark:border-gray-700" />;
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
      <div className="w-full max-w-full h-64 md:h-96 relative my-4 rounded-lg overflow-hidden shadow-md">
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
