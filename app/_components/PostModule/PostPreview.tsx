import ImageWithFallback from "../commons/ImageWithFallback";
import { EMPTY_STRING } from "@lib/configs/constants";
import { Post } from "@prisma/client";
import React from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

export interface PostPreviewProps {
  post: Post;
}

export default function PostPreview({ post }: PostPreviewProps) {
  return (
    <div className="grid grid-rows-post">
      <div className="background row-start-1 col-span-full relative opacity-75">
        <ImageWithFallback
          src={post.thumbnail ?? EMPTY_STRING}
          alt={post.title}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="grid lg:grid-cols-12 -mt-20 relative z-20">
        <div className="col-start-3 col-span-9 p-4 shadow-md bg-white text-slate-primary dark:bg-primary dark:text-slate-50 rounded-md">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold rounded-md mb-3 p-3">{post.title}</h1>
          <div className="!text-sm lg:!text-base bg-white dark:bg-transparent p-3">
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                code(props) {
                  const { children, className, node, ...rest } = props;
                  const match = /language-(\w+)/.exec(className || "javascript");
                  return match ? (
                    <SyntaxHighlighter
                      {...rest}
                      PreTag="div"
                      showLineNumbers
                      // TODO: match different languages
                      // language={match[1]}
                      language="javascript"
                      ref={null}
                      style={materialDark}>
                      {children as string}
                    </SyntaxHighlighter>
                  ) : (
                    <code {...rest} className={className}>
                      {children}
                    </code>
                  );
                },
              }}>
              {post.content}
            </Markdown>
          </div>
        </div>
      </div>
    </div>
  );
}
