"use client";

import Loader from "./Loader";
import { EMPTY_STRING } from "@lib/configs/constants";
import {
  CodeBlockEditorDescriptor,
  MDXEditorMethods,
  codeBlockPlugin,
  codeMirrorPlugin,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  toolbarPlugin,
  useCodeBlockEditorContext,
  MDXEditor,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import dynamic from "next/dynamic";
import React, { useMemo, RefObject, useRef, useEffect, memo } from "react";

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

export interface EditorProps {
  value: string;
  onChange?: any;
  readOnly?: boolean;
  editorRef?: RefObject<MDXEditorMethods | null>;
  placeholder?: string;
}

const PlainTextCodeEditorDescriptor: CodeBlockEditorDescriptor = {
  match: (language, meta) => true,
  priority: 0,
  Editor: (props) => {
    const cb = useCodeBlockEditorContext();
    return (
      <div className="h-[4rem]" onKeyDown={(e) => e.nativeEvent.stopImmediatePropagation()}>
        <textarea rows={10} cols={20} value={props.code} onChange={(e) => cb.setCode(e.target.value)} />
      </div>
    );
  },
};

export default memo(function BaseMarkdown({
  value = EMPTY_STRING,
  onChange,
  readOnly = false,
  placeholder = "Placeholder",
}: EditorProps) {
  const getPlugins = useMemo(() => {
    let basePlugins = [
      toolbarPlugin({
        toolbarContents: () => (
          <div className="flex gap-3 relative z-50">
            <BlockTypeSelect />
            <BoldItalicUnderlineToggles />
            <CreateLink />
            <ListsToggle />
            <InsertCodeBlock />
          </div>
        ),
      }),
      linkDialogPlugin(),
      headingsPlugin(),
      listsPlugin(),
      linkPlugin(),
      codeBlockPlugin({ defaultCodeBlockLanguage: "txt", codeBlockEditorDescriptors: [PlainTextCodeEditorDescriptor] }),
      codeMirrorPlugin({ codeBlockLanguages: { js: "JavaScript", css: "CSS", txt: "text", tsx: "TypeScript" } }),
    ];
    if (readOnly) basePlugins = basePlugins.slice(2);
    return basePlugins;
  }, [readOnly]);
  const localRef = useRef<MDXEditorMethods | null>(null);

  useEffect(() => {
    if (localRef.current && !localRef.current?.getMarkdown()) {
      localRef.current?.setMarkdown(value);
    }
  }, [value]);

  return (
    <div
      className={`block gap-4 flex-1 !border !border-solid ${
        readOnly ? "border-transparent" : "!border-slate-300"
      } focus-within:outline outline-2 transition-all ease-linear duration-200 rounded h-full relative overflow-x-hidden overflow-y-auto`}>
      <div className="flex-1 relative">
        <MDXEditor
          placeholder={placeholder}
          ref={localRef}
          markdown={EMPTY_STRING}
          onChange={onChange}
          readOnly={readOnly}
          contentEditableClassName="min-[16rem]"
          plugins={getPlugins}
        />
      </div>
    </div>
  );
});
