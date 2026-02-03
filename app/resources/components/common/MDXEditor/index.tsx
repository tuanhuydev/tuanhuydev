"use client";

import { AdBannerNode, AD_BANNER_TRANSFORMER } from "./nodes/AdBannerNode";
import { CodeHighlightPlugin } from "./plugins/CodeHighlightPlugin";
import { ImportMarkdownPlugin } from "./plugins/ImportMarkdownPlugin";
import { ToolbarPlugin } from "./plugins/ToolbarPlugin";
import { theme } from "./theme";
import { cn } from "@app/resources/utils/helper";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode } from "@lexical/rich-text";
import { EditorState } from "lexical";
import { ChangeEventHandler, useState } from "react";

// Custom transformers including ad banner
const CUSTOM_TRANSFORMERS = [...TRANSFORMERS, AD_BANNER_TRANSFORMER];

const onError = (error: Error) => {
  console.error(error.message);
};

const initialConfig: InitialConfigType = {
  namespace: "MyEditor",
  theme,
  nodes: [HeadingNode, CodeNode, CodeHighlightNode, AdBannerNode, ListNode, ListItemNode, LinkNode, AutoLinkNode],
  onError,
};

const containerClass = cn(
  "w-full",
  "rounded-md border border-slate-300 dark:border-slate-600",
  "bg-white dark:bg-slate-800",
  "px-3 py-2 shadow-sm",
  "hover:border-slate-400 dark:hover:border-slate-500",
  "outline-none focus:border-primary dark:focus:border-slate-500",
  "transition-colors duration-200",
  "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "text-base text-gray-900 dark:text-gray-100 md:text-sm",
);

export interface MDXEditorProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function MDXEditor({ value = "", onChange, disabled = false }: MDXEditorProps) {
  const [isMarkdownView, setIsMarkdownView] = useState<boolean>(false);
  const [localMarkdown, setLocalMarkdown] = useState(value ?? "");

  const handleChange = (editorState: EditorState) => {
    if (onChange) {
      editorState.read(() => {
        const markdown = $convertToMarkdownString(CUSTOM_TRANSFORMERS);
        onChange(markdown);
        setLocalMarkdown(markdown);
      });
    }
  };

  const handleLocalMarkdownChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setLocalMarkdown(e.target.value);
  };

  const handleMarkdownBlur = () => {
    // Only sync to parent when user leaves the textarea
    onChange?.(localMarkdown);
  };

  return (
    <div className={containerClass}>
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin
          isMarkdownView={isMarkdownView}
          setIsMarkdownView={setIsMarkdownView}
          localMarkdown={localMarkdown}
          setLocalMarkdown={setLocalMarkdown}
        />
        <div className="relative mt-3">
          {isMarkdownView ? (
            <textarea
              className="w-full min-h-[150px] outline-none bg-transparent font-mono text-sm resize-none py-1"
              value={localMarkdown}
              onChange={handleLocalMarkdownChange}
              onBlur={handleMarkdownBlur}
              placeholder="Write your markdown here..."
            />
          ) : (
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  disabled={disabled}
                  className="outline-none min-h-[150px]"
                  aria-placeholder={"Enter some text..."}
                  placeholder={
                    <div className="absolute top-0 left-0 pointer-events-none text-slate-400 select-none">
                      Enter some text...
                    </div>
                  }
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          )}
        </div>
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ListPlugin />
        <LinkPlugin />
        <ImportMarkdownPlugin markdown={value} transformers={CUSTOM_TRANSFORMERS} />
        <OnChangePlugin onChange={handleChange} />
        <CodeHighlightPlugin />
      </LexicalComposer>
    </div>
  );
}
