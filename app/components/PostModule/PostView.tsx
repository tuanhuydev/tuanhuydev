import Loader from "@app/components/commons/Loader";
import { sourceCodeFont } from "@app/font";
import { BASE_URL, EMPTY_STRING } from "@lib/shared/commons/constants/base";
import ArrowBackIosNewOutlined from "@mui/icons-material/ArrowBackIosNewOutlined";
import LinkOutlined from "@mui/icons-material/LinkOutlined";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { memo, Suspense } from "react";
import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

const WithCopy = dynamic(() => import("../commons/hocs/WithCopy"), {
  ssr: false,
  loading: () => <Loader />,
});

const BaseImage = dynamic(() => import("../commons/BaseImage"), {
  ssr: false,
  loading: () => <Loader />,
});

const elementClasses = "mx-0 my-1 text-primary dark:text-slate-50";

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
  const responsiveContent = "";
  return (
    <div className="grid grid-cols-12 w-screen h-screen overflow-x-hidden lg:overflow-hidden auto-rows-min lg:auto-rows-fr gap-0 transition-all ease-in duration-300">
      <div className="col-span-full lg:col-span-3 px-0 py-6 flex flex-col z-10 relative">
        <div className="w-min h-min z-10 px-6">
          <Link
            href="/"
            aria-label="Navigaye back to home page"
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
              priority={false}
              className="object-cover opacity-40 lg:opacity-100 lg:rounded-md drop-shadow-md dark:drop-shadow-none"
            />
          </div>
        </div>
        <div className="absolute top-0 right-0 lg:relative flex gap-3 p-6 lg:px-6">
          <Suspense fallback={<Loader />}>
            <WithCopy content={`${BASE_URL}/posts/${post?.slug}`} title="Share">
              <div className="p-2 rounded-md flex items-center justify-center bg-white drop-shadow-md dark:drop-shadow-none hover:bg-slate-100 transition ease-in-out">
                <LinkOutlined fontSize="medium" className="text-primary" />
              </div>
            </WithCopy>
          </Suspense>
        </div>
      </div>
      <div
        className={`col-span-full overflow-y-auto lg:col-span-7 bg-white dark:bg-slate-800 px-6 pb-6 pt-0 lg:p-6 shadow-md dark:shadow-none ${responsiveContent}`}>
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
                  customStyle={{
                    borderRadius: "8px",
                    backgroundColor: "#1e1e1e",
                    fontFamily: sourceCodeFont.style.fontFamily,
                    fontWeight: sourceCodeFont.style.fontWeight,
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
              return <p {...rest} className={`${elementClasses} text-sm lg:text-base`} />;
            },
            li({ node, ...rest }) {
              return <li {...rest} className={`${elementClasses} text-sm lg:text-base`} />;
            },
            h1({ node, ...rest }) {
              return <h1 {...rest} className={`${elementClasses} text-2xl md:text-3xl lg:text-4xl`} />;
            },
            h2({ node, ...rest }) {
              return <h2 {...rest} className={`${elementClasses} text-xl md:text-2xl lg:text-3xl`} />;
            },
            h3({ node, ...rest }) {
              return <h3 {...rest} className={`${elementClasses} text-lg md:text-xl lg:text-2xl`} />;
            },
            h4({ node, ...rest }) {
              return <h2 {...rest} className={`${elementClasses} text-base md:text-lg lg:text-xl`} />;
            },
            h5({ node, ...rest }) {
              return <h5 {...rest} className={`${elementClasses} text-base lg:text-lg`} />;
            },
            h6({ node, ...rest }) {
              return <h6 {...rest} className={`${elementClasses} text-base lg:text-base`} />;
            },
            a({ node, ...rest }) {
              return (
                <a {...rest} target="_blank" className="mx-0 my-1 !text-blue-400 dark:!text-blue-800 hover:underline" />
              );
            },
            pre({ node, ...rest }) {
              return <pre {...rest} className="rounded-md overflow-auto text-xs lg:text-base" />;
            },
          }}>
          {post.content}
        </Markdown>
      </div>
    </div>
  );
});

PostView.displayName = "PostView";

export default PostView;
