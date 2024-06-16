"use client";

import Loader from "./Loader";
import { useFetch } from "@app/queries/useSession";
import { EMPTY_STRING } from "@lib/configs/constants";
import {
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

const BlockTypeSelect = dynamic(async () => (await import("@mdxeditor/editor")).BlockTypeSelect, {
  ssr: false,
  loading: () => <Loader />,
});

const BoldItalicUnderlineToggles = dynamic(async () => (await import("@mdxeditor/editor")).BoldItalicUnderlineToggles, {
  ssr: false,
  loading: () => <Loader />,
});
const CreateLink = dynamic(async () => (await import("@mdxeditor/editor")).CreateLink, {
  ssr: false,
  loading: () => <Loader />,
});
const InsertCodeBlock = dynamic(async () => (await import("@mdxeditor/editor")).InsertCodeBlock, {
  ssr: false,
  loading: () => <Loader />,
});
const ListsToggle = dynamic(async () => (await import("@mdxeditor/editor")).ListsToggle, {
  ssr: false,
  loading: () => <Loader />,
});
const ChangeCodeMirrorLanguage = dynamic(async () => (await import("@mdxeditor/editor")).ChangeCodeMirrorLanguage, {
  ssr: false,
  loading: () => <Loader />,
});
const InsertImage = dynamic(async () => (await import("@mdxeditor/editor")).InsertImage, {
  ssr: false,
  loading: () => <Loader />,
});

export interface EditorProps {
  value: string;
  onChange?: any;
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
}: EditorProps) {
  const localRef = useRef<MDXEditorMethods | null>(null);
  const { fetch } = useFetch();

  useEffect(() => {
    if (localRef.current && !localRef.current?.getMarkdown()) {
      localRef.current?.setMarkdown(value);
    }
  }, [value]);

  return (
    <div
      className={`block gap-4 flex-1 !border !border-solid ${
        readOnly ? "border-transparent" : "!border-slate-300"
      } ${className} focus-within:outline outline-1 transition-all flex-1 ease-linear duration-200 rounded h-full relative overflow-x-hidden overflow-y-auto bg-white dark:bg-primary`}>
      <MDXEditor
        placeholder={placeholder}
        ref={localRef}
        markdown={EMPTY_STRING}
        onChange={onChange}
        readOnly={readOnly}
        contentEditableClassName="min-[16rem]"
        plugins={[
          toolbarPlugin({
            toolbarContents: () => (
              <div className="flex gap-3 relative z-50">
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
              const response: Response = await fetch("/api/upload/image", {
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
            codeBlockLanguages: { js: "JavaScript", css: "CSS", txt: "text", tsx: "TypeScript" },
          }),
        ]}
      />
    </div>
  );
}
