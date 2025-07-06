"use client";

// Import styles
import "./DynamicEditor.css";
import { ImageNode } from "./nodes/ImageNode";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { ListNode, ListItemNode } from "@lexical/list";
import { $convertFromMarkdownString, $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { HeadingNode } from "@lexical/rich-text";
import { QuoteNode } from "@lexical/rich-text";
import { $createParagraphNode, $getRoot } from "lexical";
import { EditorState } from "lexical";
import { useCallback, useRef, useState } from "react";

export interface DynamicEditorProps {
  value?: string;
  onChange?: (markdown: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  showModeToggle?: boolean;
}

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "editor-placeholder",
  paragraph: "editor-paragraph",
  quote: "editor-quote",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
    h6: "editor-heading-h6",
  },
  list: {
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listitem",
  },
  image: "editor-image",
  link: "editor-link",
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    overflowed: "editor-text-overflowed",
    hashtag: "editor-text-hashtag",
    underline: "editor-text-underline",
    strikethrough: "editor-text-strikethrough",
    underlineStrikethrough: "editor-text-underlineStrikethrough",
    code: "editor-text-code",
  },
  code: "editor-code",
  codeHighlight: {
    atrule: "editor-tokenAttr",
    attr: "editor-tokenAttr",
    boolean: "editor-tokenProperty",
    builtin: "editor-tokenSelector",
    cdata: "editor-tokenComment",
    char: "editor-tokenSelector",
    class: "editor-tokenFunction",
    "class-name": "editor-tokenFunction",
    comment: "editor-tokenComment",
    constant: "editor-tokenProperty",
    deleted: "editor-tokenProperty",
    doctype: "editor-tokenComment",
    entity: "editor-tokenOperator",
    function: "editor-tokenFunction",
    important: "editor-tokenVariable",
    inserted: "editor-tokenSelector",
    keyword: "editor-tokenAttr",
    namespace: "editor-tokenVariable",
    number: "editor-tokenProperty",
    operator: "editor-tokenOperator",
    prolog: "editor-tokenComment",
    property: "editor-tokenProperty",
    punctuation: "editor-tokenPunctuation",
    regex: "editor-tokenVariable",
    selector: "editor-tokenSelector",
    string: "editor-tokenSelector",
    symbol: "editor-tokenProperty",
    tag: "editor-tokenProperty",
    url: "editor-tokenOperator",
    variable: "editor-tokenVariable",
  },
};

// Editor configuration
function onError(error: Error) {
  console.error("Lexical Error:", error);
}

const DynamicEditor: React.FC<DynamicEditorProps> = ({
  value = "",
  onChange,
  placeholder = "Start writing...",
  className = "",
  readOnly = false,
  showModeToggle = true,
}) => {
  const isFirstRender = useRef(true);
  const [viewMode, setViewMode] = useState<"rich" | "markdown">("rich");

  const initialConfig = {
    namespace: "DynamicEditor",
    theme,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
      AutoLinkNode,
      ImageNode,
    ],
    editorState: () => {
      if (value && value.trim()) {
        $convertFromMarkdownString(value, TRANSFORMERS);
      } else {
        // Set default state with an empty paragraph
        const root = $getRoot();
        if (root.getFirstChild() === null) {
          const paragraph = $createParagraphNode();
          root.append(paragraph);
        }
      }
    },
    editable: !readOnly,
  };

  const handleChange = useCallback(
    (editorState: EditorState) => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }

      editorState.read(() => {
        const markdown = $convertToMarkdownString(TRANSFORMERS);
        onChange?.(markdown);
      });
    },
    [onChange],
  );

  return (
    <div className={`dynamic-editor ${className}`}>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-container">
          {!readOnly && (
            <ToolbarPlugin showModeToggle={showModeToggle} viewMode={viewMode} onViewModeChange={setViewMode} />
          )}
          <div className="editor-inner">
            {viewMode === "rich" ? (
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    className="editor-input"
                    aria-placeholder={placeholder}
                    placeholder={<div className="editor-placeholder">{placeholder}</div>}
                  />
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
            ) : (
              <div className="markdown-editor">
                <textarea
                  className="markdown-textarea"
                  value={value}
                  onChange={(e) => onChange?.(e.target.value)}
                  placeholder={placeholder}
                  style={{
                    width: "100%",
                    minHeight: "400px",
                    padding: "16px",
                    border: "none",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "Monaco, 'Cascadia Code', 'Roboto Mono', monospace",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    backgroundColor: "transparent",
                  }}
                />
              </div>
            )}
            <OnChangePlugin onChange={handleChange} />
            <HistoryPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <ListPlugin />
            <LinkPlugin />
            <AutoLinkPlugin />
            <TabIndentationPlugin />
            <CodeHighlightPlugin />
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
};

export default DynamicEditor;
