"use client";

import Loader from "./Loader";
import { useFetch } from "@app/queries/useSession";
import { EMPTY_STRING } from "@lib/shared/commons/constants/base";
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
import dynamic from "next/dynamic";
import { RefObject, useEffect, useRef } from "react";

const BoldItalicUnderlineToggles = dynamic(
  () => import("@mdxeditor/editor").then((m) => m.BoldItalicUnderlineToggles),
  { ssr: false, loading: () => <Loader /> },
);
const CreateLink = dynamic(() => import("@mdxeditor/editor").then((m) => m.CreateLink), {
  ssr: false,
  loading: () => <Loader />,
});
const InsertCodeBlock = dynamic(() => import("@mdxeditor/editor").then((m) => m.InsertCodeBlock), {
  ssr: false,
  loading: () => <Loader />,
});
const ListsToggle = dynamic(() => import("@mdxeditor/editor").then((m) => m.ListsToggle), {
  ssr: false,
  loading: () => <Loader />,
});
const ChangeCodeMirrorLanguage = dynamic(() => import("@mdxeditor/editor").then((m) => m.ChangeCodeMirrorLanguage), {
  ssr: false,
  loading: () => <Loader />,
});
const InsertImage = dynamic(() => import("@mdxeditor/editor").then((m) => m.InsertImage), {
  ssr: false,
  loading: () => <Loader />,
});

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
              <div className="flex gap-3 relative z-300">
                <DiffSourceToggleWrapper>
                  <UndoRedo />
                </DiffSourceToggleWrapper>
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
