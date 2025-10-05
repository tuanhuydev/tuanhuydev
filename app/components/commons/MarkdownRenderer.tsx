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
        <code {...rest} className={`rounded-md ${className ?? ""}`}>
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
        className="rounded-md"
        ref={null as any}
        style={darkMode ? darcula : docco}>
        {String(children ?? "")}
      </SyntaxHighlighter>
    );
  },
  pre({ node, ...rest }) {
    return <pre {...rest} className="rounded-md overflow-auto text-xs lg:text-sm" />;
  },
  p({ node, ...rest }) {
    return <p {...rest} className="my-1" />;
  },
  ul({ node, ...rest }) {
    return <ul {...rest} className="list-disc pl-5 my-1" />;
  },
  ol({ node, ...rest }) {
    return <ol {...rest} className="list-decimal pl-5 my-1" />;
  },
  li({ node, ...rest }) {
    return <li {...rest} className="my-0.5" />;
  },
  a({ node, ...rest }) {
    return <a {...rest} target="_blank" className="underline text-blue-600 dark:text-blue-400" />;
  },
  img({ src, alt }) {
    return (
      <div className="w-full max-w-full h-60 relative">
        <Image src={src as string} alt={(alt as string) || "image"} fill className="object-contain rounded-md" />
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
