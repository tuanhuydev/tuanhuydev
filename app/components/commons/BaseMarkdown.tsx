"use client";

import { useFetch } from "@app/_queries/useSession";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  ConditionalContents,
  CreateLink,
  InsertCodeBlock,
  InsertImage,
  ListsToggle,
  MDXEditor,
  MDXEditorMethods,
  UndoRedo,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { EMPTY_STRING } from "lib/commons/constants/base";
import { RefObject, memo, useCallback, useEffect, useMemo, useRef } from "react";

export interface EditorProps {
  value: string;
  onChange?: (markdown: string) => void;
  className?: string;
  readOnly?: boolean;
  editorRef?: RefObject<MDXEditorMethods | null>;
  placeholder?: string;
}

// Memoized toolbar component to prevent re-renders
const ToolbarContents = memo(() => (
  <div className="flex flex-wrap gap-3 relative z-300 max-w-lg">
    <UndoRedo />
    <BlockTypeSelect />
    <BoldItalicUnderlineToggles />
    <CreateLink />
    <ListsToggle />
    <ConditionalContents
      options={[
        {
          when: (editor) => editor?.editorType === "codeblock",
          contents: () => <ChangeCodeMirrorLanguage />,
        },
        {
          fallback: () => <InsertCodeBlock />,
        },
      ]}
    />
    <InsertImage />
  </div>
));

ToolbarContents.displayName = "ToolbarContents";

function BaseMarkdown({
  value = EMPTY_STRING,
  onChange,
  readOnly = false,
  className = "",
  placeholder = "Placeholder",
  editorRef,
}: EditorProps) {
  const localRef = useRef<MDXEditorMethods | null>(null);
  const { fetch } = useFetch();
  const previousValue = useRef<string>(value);

  // Memoized image upload handler to prevent recreation
  const imageUploadHandler = useCallback(
    async (image: File) => {
      const formData = new FormData();
      formData.append("file", image);
      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Unable to upload image");
      const { data: uploadedImage } = await response.json();
      return uploadedImage?.Location;
    },
    [fetch],
  );

  // Memoized plugins to prevent recreation on every render
  const plugins = useMemo(
    () => [
      toolbarPlugin({
        toolbarContents: () => <ToolbarContents />,
      }),
      diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: value }),
      linkDialogPlugin(),
      headingsPlugin(),
      listsPlugin(),
      linkPlugin(),
      imagePlugin({
        imageUploadHandler,
      }),
      markdownShortcutPlugin(),
      codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
      codeMirrorPlugin({
        codeBlockLanguages: {
          js: "JavaScript",
          css: "CSS",
          txt: "text",
          tsx: "TypeScript",
          bash: "Bash",
          json: "JSON",
          python: "Python",
        },
      }),
    ],
    [value, imageUploadHandler],
  );

  // Sync external ref more efficiently
  useEffect(() => {
    if (editorRef && localRef.current) {
      (editorRef as any).current = localRef.current;
    }
  }, [editorRef]);

  // Only update markdown if value actually changed
  useEffect(() => {
    if (localRef.current && previousValue.current !== value && value !== localRef.current.getMarkdown()) {
      localRef.current.setMarkdown(value);
      previousValue.current = value;
    }
  }, [value]);

  // Memoized className to prevent unnecessary re-renders
  const memoizedClassName = useMemo(
    () =>
      `block z-0 gap-4 flex-1 relative !border !border-solid ${
        readOnly ? "border-transparent" : "!border-slate-300"
      } ${className} focus-within:outline outline-1 transition-all ease-linear duration-200 rounded h-full overflow-x-hidden overflow-y-auto bg-white dark:bg-primary`,
    [readOnly, className],
  );

  return (
    <div className={memoizedClassName}>
      <MDXEditor
        ref={localRef}
        markdown={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        contentEditableClassName="min-[16rem] text-primary dark:text-slate-50"
        plugins={plugins}
      />
    </div>
  );
}

export default memo(BaseMarkdown);
