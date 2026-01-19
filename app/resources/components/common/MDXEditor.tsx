"use client";

import { Button } from "./Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";
import { cn } from "@app/resources/utils/helper";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { $createCodeNode } from "@lexical/code";
import { registerCodeHighlighting } from "@lexical/code";
import { $convertFromMarkdownString, $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { $createHeadingNode, HeadingNode, HeadingTagType } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";
import { $getNearestNodeOfType } from "@lexical/utils";
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  BaseSelection,
  COMMAND_PRIORITY_LOW,
  EditorState,
  EditorThemeClasses,
  SELECTION_CHANGE_COMMAND,
  TextFormatType,
} from "lexical";
import { Bold, Code, FileCodeCorner, FilePen, Italic, Underline } from "lucide-react";
import { ChangeEventHandler, Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

const theme: EditorThemeClasses = {
  // Headings
  heading: {
    h1: "text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-5 sm:mt-6 mb-2.5 sm:mb-3 pb-2 leading-tight",
    h2: "text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mt-4 sm:mt-5 mb-2 pb-1.5 leading-tight",
    h3: "text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white mt-3 sm:mt-4 mb-1.5 sm:mb-2 leading-snug",
    h4: "text-sm sm:text-base font-semibold text-gray-900 dark:text-white mt-3 mb-1.5 leading-snug",
    h5: "text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mt-2 sm:mt-3 mb-1 sm:mb-1.5 leading-normal",
    h6: "text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mt-2 mb-1 leading-normal",
  },

  // Standard Text
  paragraph: "my-2 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300",

  // Quotes
  quote:
    "border-l-4 border-blue-500 dark:border-blue-400 pl-3 sm:pl-4 py-1.5 sm:py-2 my-2 sm:my-3 bg-blue-50 dark:bg-slate-800/50 rounded-r-md italic text-sm sm:text-base text-gray-700 dark:text-gray-300",

  // Lists
  list: {
    ul: "list-disc pl-4 sm:pl-5 my-2 space-y-1 text-sm sm:text-base text-gray-700 dark:text-gray-300",
    ol: "list-decimal pl-4 sm:pl-5 my-2 space-y-1 text-sm sm:text-base text-gray-700 dark:text-gray-300",
    listitem: "leading-relaxed pl-0.5 sm:pl-1",
    nested: {
      listitem: "list-none",
    },
  },

  // Links
  link: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-2 transition-colors cursor-pointer",

  // Inline Formatting
  text: {
    bold: "font-bold text-gray-900 dark:text-white",
    italic: "italic text-gray-700 dark:text-gray-300",
    underline: "underline",
    strikethrough: "line-through text-gray-500 dark:text-gray-400",
    underlineStrikethrough: "underline line-through",
    code: "rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-sm font-mono text-pink-600 dark:text-pink-400", // Inline style
  },

  // --- VS CODE DARK+ CODE BLOCK ---
  code: "block rounded-lg overflow-auto text-xs sm:text-sm my-3 sm:my-4 bg-[#1E1E1E] p-4 font-mono border border-slate-800 shadow-md text-[#D4D4D4] leading-normal selection:bg-[#264F78]",

  // Syntax Tokens
  codeHighlight: {
    atrule: "text-[#C586C0]",
    attr: "text-[#9CDCFE]",
    boolean: "text-[#569CD6]",
    builtin: "text-[#4EC9B0]",
    comment: "text-[#6A9955] italic",
    constant: "text-[#4FC1FF]",
    function: "text-[#DCDCAA]",
    important: "text-[#569CD6]",
    keyword: "text-[#569CD6]",
    number: "text-[#B5CEA8]",
    operator: "text-[#D4D4D4]",
    prolog: "text-[#6A9955]",
    property: "text-[#9CDCFE]",
    punctuation: "text-[#D4D4D4]",
    regex: "text-[#D16969]",
    selector: "text-[#D7BA7D]",
    string: "text-[#CE9178]",
    symbol: "text-[#4FC1FF]",
    tag: "text-[#569CD6]",
    url: "text-[#9CDCFE]",
    variable: "text-[#9CDCFE]",
  },

  // Tables
  table:
    "w-full my-3 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-xs sm:text-sm",
  tableCell:
    "px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 border-b border-slate-200 dark:border-slate-700",
  tableCellHeader:
    "bg-slate-50 dark:bg-slate-800 px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-white border-b border-slate-200 dark:border-slate-700",
  tableRow: "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",

  // Misc
  hr: "my-4 border-t border-gray-200 dark:border-gray-700",
  image: "w-full max-w-full h-auto my-2 sm:my-3 rounded-lg overflow-hidden shadow-md",
};
const onError = (error: Error) => {
  console.error(error.message);
};

const initialConfig: InitialConfigType = {
  namespace: "MyEditor",
  theme,
  nodes: [HeadingNode, CodeNode, CodeHighlightNode],
  onError,
};

export const FormatTypes = [
  "bold",
  "underline",
  "strikethrough",
  "italic",
  "highlight",
  "code",
  "subscript",
  "superscript",
  "lowercase",
  "uppercase",
  "capitalize",
];

export type BlockType = HeadingTagType & "p";

const ToolbarPlugin = ({
  isMarkdownView = false,
  setIsMarkdownView,
  localMarkdown = "",
  setLocalMarkdown,
}: {
  isMarkdownView?: boolean;
  setIsMarkdownView: Dispatch<SetStateAction<boolean>>;
  localMarkdown?: string;
  setLocalMarkdown: Dispatch<SetStateAction<string>>;
}) => {
  const [editor] = useLexicalComposerContext();
  const [activeFormat, setActiveFormat] = useState<Set<TextFormatType>>(new Set());
  const [activeBlockType, setActiveBlockType] = useState<BlockType>("p" as BlockType);
  const [disabled, setDisabled] = useState<boolean>(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const nearestNode = $getNearestNodeOfType(anchorNode, CodeNode);
      setDisabled(nearestNode !== null);

      const newActiveFormats: Set<TextFormatType> = new Set<TextFormatType>();

      // Iterate through your config and check each one
      FormatTypes.forEach((format: string) => {
        if (selection.hasFormat(format as TextFormatType)) {
          newActiveFormats.add(format as TextFormatType);
        }
      });
      setActiveFormat(newActiveFormats);
    }
  }, []);

  const handleFormat = useCallback(
    (type: TextFormatType) => () => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.formatText(type);
          const newActiveFormats = new Set<TextFormatType>();
          if (activeFormat.has(type)) {
            newActiveFormats.add(type);
          }
          setActiveFormat(newActiveFormats);
        }
      });
    },
    [editor],
  );

  const createHeadingChange = (value: HeadingTagType) => {
    editor.update(() => {
      const selection: BaseSelection | null = $getSelection();
      console.log(selection);
      if (selection && $isRangeSelection(selection)) {
        $setBlocksType(selection as BaseSelection, () => $createHeadingNode(value));
        setActiveBlockType(value as BlockType);
      }
    });
  };

  const toggleMarkdown = () => {
    setIsMarkdownView(!isMarkdownView);
    if (isMarkdownView) {
      editor.update(() => {
        $convertFromMarkdownString(localMarkdown);
      });
    } else {
      editor.read(() => {
        const markdownString: string = $convertToMarkdownString(TRANSFORMERS);
        setLocalMarkdown(markdownString);
      });
    }
  };

  const insertCodeBlock = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // If the selection is empty, it creates an empty code block
        // If there is text, it wraps that text in a code block
        $setBlocksType(selection, () => $createCodeNode());
      }
    });
  };

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(
          () => {
            $updateToolbar();
          },
          { editor },
        );
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, $updateToolbar]);

  const options = [
    { label: "normal", value: "p" },
    { label: "heading 1", value: "h1" },
    { label: "heading 2", value: "h2" },
    { label: "heading 3", value: "h3" },
    { label: "heading 4", value: "h4" },
    { label: "heading 5", value: "h5" },
    { label: "heading 6", value: "h6" },
  ];
  return (
    <div className="flex items-center gap-2 bg-zinc-50 dark:bg-primary p-1 rounded-lg">
      <div className="w-[300px] relative">
        <Select value={activeBlockType as string} disabled={disabled} onValueChange={createHeadingChange}>
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder={"Please select"} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option: SelectOption<string>) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        size={"icon"}
        disabled={disabled}
        variant={activeFormat.has("bold") ? "default" : "outline"}
        onClick={handleFormat("bold")}>
        <Bold />
      </Button>
      <Button
        size={"icon"}
        disabled={disabled}
        variant={activeFormat.has("italic") ? "default" : "outline"}
        onClick={handleFormat("italic")}>
        <Italic />
      </Button>
      <Button
        size={"icon"}
        disabled={disabled}
        variant={activeFormat.has("underline") ? "default" : "outline"}
        onClick={handleFormat("underline")}>
        <Underline />
      </Button>
      <Button size={"icon"} variant={activeFormat.has("underline") ? "default" : "outline"} onClick={insertCodeBlock}>
        <Code />
      </Button>
      <Button variant="outline" size="icon" onClick={toggleMarkdown}>
        {isMarkdownView ? <FilePen /> : <FileCodeCorner />}
      </Button>
    </div>
  );
};

export function CodeHighlightPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // This connects the editor to the syntax highlighting logic
    return registerCodeHighlighting(editor);
  }, [editor]);

  return null;
}
const containerClass = cn(
  // general
  "w-full",
  // Border & Radius
  "rounded-md border border-slate-300 dark:border-slate-600",
  // Background
  "bg-white dark:bg-slate-800",
  // Padding & Shadow
  "px-3 py-2 shadow-sm",
  // Hover State
  "hover:border-slate-400 dark:hover:border-slate-500",
  // Focus State
  "outline-none focus:border-primary dark:focus:border-slate-500",
  // Transitions
  "transition-colors duration-200",
  // File Input Styles
  "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
  // Disabled State
  "disabled:cursor-not-allowed disabled:opacity-50",
  // Text
  "text-base text-gray-900 dark:text-gray-100 md:text-sm",
);

const ImportMarkdownPlugin = ({ markdown }: { markdown: string }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      // 1. get current markdown content
      const currentContent = $convertToMarkdownString(TRANSFORMERS);

      // 2. Only import if the prop is different from internal state
      if (markdown !== currentContent) {
        const root = $getRoot();
        root.clear();

        $convertFromMarkdownString(markdown, TRANSFORMERS);
      }
    });
  }, [editor, markdown]);

  return null;
};

export interface MDXEditorProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const MDXEditor = ({ value = "", onChange, disabled = false }: MDXEditorProps) => {
  const [isMarkdownView, setIsMarkdownView] = useState<boolean>(false);
  const [localMarkdown, setLocalMarkdown] = useState(value ?? "");

  const handleChange = (editorState: EditorState) => {
    if (onChange) {
      editorState.read(() => {
        const markdown = $convertToMarkdownString(TRANSFORMERS);
        onChange(markdown);
        setLocalMarkdown(markdown);
      });
    }
  };

  const handleLocalMarkdownChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setLocalMarkdown(e.target.value);
    onChange?.(e.target.value);
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
            /* --- RAW MARKDOWN VIEW --- */
            <textarea
              className="w-full min-h-[150px] outline-none bg-transparent font-mono text-sm resize-none py-1"
              value={localMarkdown}
              onChange={handleLocalMarkdownChange}
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
        <ImportMarkdownPlugin markdown={value} />
        <OnChangePlugin onChange={handleChange} />
        <CodeHighlightPlugin />
      </LexicalComposer>
    </div>
  );
};
