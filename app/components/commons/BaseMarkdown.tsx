"use client";

import Loader from "./Loader";
import { useFetch } from "@app/_queries/useSession";
import {
  BlockTypeSelect,
  ConditionalContents,
  DiffSourceToggleWrapper,
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
import { RefObject, Suspense, lazy, useEffect, useRef } from "react";

// Replace dynamic imports with React lazy
const BoldItalicUnderlineToggles = lazy(() =>
  import("@mdxeditor/editor").then((m) => ({ default: m.BoldItalicUnderlineToggles })),
);
const CreateLink = lazy(() => import("@mdxeditor/editor").then((m) => ({ default: m.CreateLink })));
const InsertCodeBlock = lazy(() => import("@mdxeditor/editor").then((m) => ({ default: m.InsertCodeBlock })));
const ListsToggle = lazy(() => import("@mdxeditor/editor").then((m) => ({ default: m.ListsToggle })));
const ChangeCodeMirrorLanguage = lazy(() =>
  import("@mdxeditor/editor").then((m) => ({ default: m.ChangeCodeMirrorLanguage })),
);
const InsertImage = lazy(() => import("@mdxeditor/editor").then((m) => ({ default: m.InsertImage })));

export interface EditorProps {
  value: string;
  onChange?: (markdown: string) => void;
  className?: string;
  readOnly?: boolean;
  editorRef?: RefObject<MDXEditorMethods | null>;
  placeholder?: string;
}

export default function BaseMarkdown({
  value = EMPTY_STRING,
  onChange,
  readOnly = false,
  className = "",
  placeholder = "Placeholder",
  editorRef,
}: EditorProps) {
  const localRef = useRef<MDXEditorMethods | null>(null);
  const { fetch } = useFetch();

  // Sync value externally if editorRef is passed
  useEffect(() => {
    if (editorRef) {
      (editorRef as any).current = localRef.current;
    }
  }, [editorRef]);

  // Only update markdown if it's different
  useEffect(() => {
    const current = localRef.current?.getMarkdown();
    if (localRef.current && current !== value) {
      localRef.current.setMarkdown(value);
    }
  }, [value]);

  return (
    <div
      className={`block z-0 gap-4 flex-1 relative !border !border-solid ${
        readOnly ? "border-transparent" : "!border-slate-300"
      } ${className} focus-within:outline outline-1 transition-all ease-linear duration-200 rounded h-full overflow-x-hidden overflow-y-auto bg-white dark:bg-primary`}>
      <MDXEditor
        ref={localRef}
        markdown={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        contentEditableClassName="min-[16rem] text-primary dark:text-slate-50"
        plugins={[
          toolbarPlugin({
            toolbarContents: () => (
              <div className="flex flex-wrap gap-3 relative z-300 max-w-lg">
                <UndoRedo />
                <BlockTypeSelect />
                <Suspense fallback={<Loader />}>
                  <BoldItalicUnderlineToggles />
                </Suspense>
                <Suspense fallback={<Loader />}>
                  <CreateLink />
                </Suspense>
                <Suspense fallback={<Loader />}>
                  <ListsToggle />
                </Suspense>
                <ConditionalContents
                  options={[
                    {
                      when: (editor) => editor?.editorType === "codeblock",
                      contents: () => (
                        <Suspense fallback={<Loader />}>
                          <ChangeCodeMirrorLanguage />
                        </Suspense>
                      ),
                    },
                    {
                      fallback: () => (
                        <Suspense fallback={<Loader />}>
                          <InsertCodeBlock />
                        </Suspense>
                      ),
                    },
                  ]}
                />
                <Suspense fallback={<Loader />}>
                  <InsertImage />
                </Suspense>
              </div>
            ),
          }),
          diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: value }),
          linkDialogPlugin(),
          headingsPlugin(),
          listsPlugin(),
          linkPlugin(),
          imagePlugin({
            imageUploadHandler: async (image: File) => {
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
        ]}
      />
    </div>
  );
}
