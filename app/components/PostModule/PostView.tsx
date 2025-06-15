"use client";

import BaseImage from "../commons/BaseImage";
import WithCopy from "../commons/hocs/WithCopy";
import { sourceCodeFont } from "@app/font";
import ArrowBackIosNewOutlined from "@mui/icons-material/ArrowBackIosNewOutlined";
import LinkOutlined from "@mui/icons-material/LinkOutlined";
import { BASE_URL, EMPTY_STRING } from "lib/commons/constants/base";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

// Optimized CSS variables and classes for better inheritance
const elementClasses = "mx-0 my-1";
const baseTextSizes = "text-sm lg:text-base";

const language: Record<string, string> = {
  txt: "text",
  tsx: "typescript",
  css: "css",
  js: "javascript",
  json: "json",
  bash: "bash",
  python: "python",
};

export interface PostViewProps {
  post: Post;
}

const PostView = memo(({ post }: PostViewProps) => {
  if (!post) return <h1>Not Found</h1>;

  return (
    <div className="grid grid-cols-12 w-screen h-screen overflow-x-hidden lg:overflow-hidden auto-rows-min lg:auto-rows-fr gap-0 transition-transform duration-300 ease-out bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      {/* Left sidebar */}
      <div className="col-span-full lg:col-span-3 px-0 py-6 flex flex-col relative contain-layout">
        {/* Back button */}
        <div className="w-min h-min px-6">
          <button
            onClick={() => window.history.back()}
            aria-label="Go back to previous page"
            className="p-2 rounded-md flex items-center justify-center border-none bg-white dark:bg-slate-700 shadow-sm dark:shadow-none hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors duration-200 will-change-auto">
            <ArrowBackIosNewOutlined fontSize="small" className="text-primary dark:text-slate-300" />
          </button>
        </div>

        {/* Post title */}
        <h1 className="text-4xl md:text-5xl font-bold px-6 py-4 m-0 lg:my-6 lg:max-h-[24rem] text-primary dark:text-slate-50 overflow-auto">
          {post.title}
        </h1>

        {/* Post thumbnail */}
        <div className="lg:grow relative">
          <div className="absolute inset-0 lg:relative lg:w-3/4 lg:h-[15rem] px-0 lg:px-6">
            <BaseImage
              src={post.thumbnail ?? EMPTY_STRING}
              alt={post.title}
              fill
              sizes="100vw"
              priority={false}
              className="object-cover lg:rounded-md shadow-sm dark:shadow-none transition-opacity duration-300 opacity-40"
            />
          </div>
        </div>

        {/* Share button */}
        <div className="absolute top-0 right-0 lg:relative flex gap-3 p-6 lg:px-6">
          <WithCopy content={`${BASE_URL}/posts/${post?.slug}`} title="Share">
            <div className="p-2 rounded-md flex items-center justify-center bg-white dark:bg-slate-700 shadow-sm dark:shadow-none hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors duration-200 will-change-auto">
              <LinkOutlined fontSize="medium" className="text-primary dark:text-slate-300" />
            </div>
          </WithCopy>
        </div>
      </div>

      {/* Main content area */}
      <div className="col-span-full overflow-y-auto lg:col-span-7 bg-white dark:bg-slate-800 px-6 pb-6 pt-0 lg:p-6 shadow-md dark:shadow-none text-primary dark:text-slate-50 contain-layout">
        <div className={`markdown-content ${baseTextSizes}`}>
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code(props) {
                const { children, className, node, ...rest } = props;
                const match = /language-(\w+)/.exec(className as string);
                if (!match) {
                  return (
                    <code {...rest} className={`rounded-md ${className}`}>
                      {children}
                    </code>
                  );
                }
                const extension = (match[1] as string) ?? "txt";

                return match ? (
                  <SyntaxHighlighter
                    {...rest}
                    PreTag="div"
                    showLineNumbers
                    language={language[extension] as string}
                    className="rounded-md"
                    ref={null}
                    style={darcula}>
                    {children as string}
                  </SyntaxHighlighter>
                ) : (
                  <code {...rest} className={`rounded-md ${className}`}>
                    {children}
                  </code>
                );
              },
              img({ src }) {
                return (
                  <div className="w-full h-80 relative">
                    <Image src={src as string} alt="image" fill className="object-cover rounded-md w-full" />
                  </div>
                );
              },
              p({ node, ...rest }) {
                return <p {...rest} className={elementClasses} />;
              },
              li({ node, ...rest }) {
                return <li {...rest} className={elementClasses} />;
              },
              h1({ node, ...rest }) {
                return <h1 {...rest} className={`${elementClasses} text-2xl md:text-3xl lg:text-4xl font-bold`} />;
              },
              h2({ node, ...rest }) {
                return <h2 {...rest} className={`${elementClasses} text-xl md:text-2xl lg:text-3xl font-semibold`} />;
              },
              h3({ node, ...rest }) {
                return <h3 {...rest} className={`${elementClasses} text-lg md:text-xl lg:text-2xl font-semibold`} />;
              },
              h4({ node, ...rest }) {
                return <h4 {...rest} className={`${elementClasses} text-base md:text-lg lg:text-xl font-medium`} />;
              },
              h5({ node, ...rest }) {
                return <h5 {...rest} className={`${elementClasses} text-base lg:text-lg font-medium`} />;
              },
              h6({ node, ...rest }) {
                return <h6 {...rest} className={`${elementClasses} text-base font-medium`} />;
              },
              a({ node, ...rest }) {
                return (
                  <a
                    {...rest}
                    target="_blank"
                    className="mx-0 my-1 !text-blue-600 dark:!text-blue-400 hover:underline transition-colors duration-200"
                  />
                );
              },
              pre({ node, ...rest }) {
                return <pre {...rest} className="rounded-md overflow-auto text-xs lg:text-base will-change-scroll" />;
              },
            }}>
            {post.content}
          </Markdown>
        </div>
      </div>
    </div>
  );
});

PostView.displayName = "PostView";

export default PostView;
