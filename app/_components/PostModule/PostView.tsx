"use client";

import HighlightPost from "../HomeModule/BlogSection/HighlightPost";
import { usePostsQuery } from "@app/queries";
import Loader from "@components/commons/Loader";
import WithCopy from "@components/commons/hocs/WithCopy";
import { EMPTY_STRING } from "@lib/configs/constants";
import ArrowBackIosNewOutlined from "@mui/icons-material/ArrowBackIosNewOutlined";
import LinkOutlined from "@mui/icons-material/LinkOutlined";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { darcula } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

const BaseImage = dynamic(() => import("../commons/BaseImage"), {
  ssr: false,
  loading: () => <Loader />,
});

const Markdown = dynamic(() => import("react-markdown"), {
  ssr: false,
  loading: () => <Loader />,
});
const SyntaxHighlighter = dynamic(() => import("react-syntax-highlighter"), {
  ssr: false,
  loading: () => <Loader />,
});

export interface PostViewProps {
  post: ObjectType;
}

export default function PostView({ post }: PostViewProps) {
  const { data: posts = [], isFetching } = usePostsQuery({ published: true, exclude: [post._id] });
  if (!post) return <h1>Not Found</h1>;
  if (isFetching) return <Loader />;
  return (
    <div className="grid grid-cols-12 w-screen h-screen overflow-x-hidden lg:overflow-hidden auto-rows-min lg:auto-rows-fr gap-0 transition-all ease-in duration-300">
      <div className="col-span-full lg:col-span-3 px-0 py-6 flex flex-col z-10 relative">
        <div className="w-min h-min z-10 px-6">
          <Link
            href="/"
            className="p-2 rounded-md flex items-center justify-center bg-white drop-shadow-md dark:drop-shadow-none hover:bg-slate-100 transition ease-in-out">
            <ArrowBackIosNewOutlined fontSize="small" className="text-primary" />
          </Link>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold px-6 py-4 m-0 lg:my-6 lg:max-h-[24rem] text-primary dark:text-slate-50 overflow-auto z-10">
          {post.title}
        </h1>
        <div className="lg:grow">
          <div className="absolute top-0 lg:relative w-full h-full lg:w-3/4 lg:h-[15rem] px-0 lg:px-6">
            <BaseImage
              src={post.thumbnail ?? EMPTY_STRING}
              alt={post.title}
              fill
              sizes="100vw"
              className="object-cover opacity-40 lg:opacity-100 lg:rounded-md drop-shadow-md dark:drop-shadow-none"
            />
          </div>
        </div>
        <div className="absolute top-0 right-0 lg:relative flex gap-3 p-6 lg:px-6">
          <WithCopy content={window.location.href} title="Share">
            <div className="p-2 rounded-md flex items-center justify-center bg-white drop-shadow-md dark:drop-shadow-none hover:bg-slate-100 transition ease-in-out">
              <LinkOutlined fontSize="medium" className="text-primary" />
            </div>
          </WithCopy>
        </div>
      </div>
      <div
        className={`col-span-full overflow-y-auto lg:col-span-6 bg-white dark:bg-slate-800 px-6 pb-6 pt-0 lg:p-6 shadow-md dark:shadow-none`}>
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
              const language: ObjectType = {
                txt: "text",
                tsx: "typescript",
                css: "css",
                js: "javascript",
              };
              const extension = (match[1] as string) ?? "txt";

              return match ? (
                <SyntaxHighlighter
                  {...rest}
                  PreTag="div"
                  showLineNumbers
                  language={language[extension] as string}
                  customStyle={{
                    borderRadius: "8px",
                  }}
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
              return <p {...rest} className="text-primary dark:text-slate-50 text-lg" />;
            },
            h1({ node, ...rest }) {
              return <h1 {...rest} className="text-primary dark:text-slate-50 text-lg" />;
            },
            h2({ node, ...rest }) {
              return <h2 {...rest} className="text-primary dark:text-slate-50 text-lg" />;
            },
            h3({ node, ...rest }) {
              return <h3 {...rest} className="text-primary dark:text-slate-50 text-lg" />;
            },
            h4({ node, ...rest }) {
              return <h2 {...rest} className="text-primary dark:text-slate-50 text-lg" />;
            },
            h5({ node, ...rest }) {
              return <h5 {...rest} className="text-primary dark:text-slate-50 text-lg" />;
            },
            h6({ node, ...rest }) {
              return <h6 {...rest} className="text-primary dark:text-slate-50 text-lg" />;
            },
            li({ node, ...rest }) {
              return <li {...rest} className="text-primary dark:text-slate-50 text-lg" />;
            },
          }}>
          {post.content}
        </Markdown>
      </div>
      <div className="col-span-full overflow-x-auto overflow-y-hidden lg:overflow-y-auto lg:col-span-3 p-4">
        {posts?.length ? (
          <Fragment>
            <div className="text-primary dark:text-slate-50 text-2xl font-bold mb-3">More Amazing Posts</div>
            <div className="flex gap-4 lg:flex-col overflow-auto">
              {posts.map((post: ObjectType) => (
                <HighlightPost post={post} key={post.slug} className="shrink-0 w-[20rem] lg:w-full" />
              ))}
            </div>
          </Fragment>
        ) : (
          <Fragment />
        )}
      </div>
    </div>
  );
}
