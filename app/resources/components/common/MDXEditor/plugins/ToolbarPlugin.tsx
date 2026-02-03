import { AdBannerDialog } from "../dialogs/AdBannerDialog";
import { LinkDialog } from "../dialogs/LinkDialog";
import { MermaidDialog } from "../dialogs/MermaidDialog";
import { $createAdBannerNode, AD_BANNER_TRANSFORMER } from "../nodes/AdBannerNode";
import { $createCodeNode } from "@lexical/code";
import { CodeNode } from "@lexical/code";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { $convertFromMarkdownString, $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, HeadingTagType } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import { Button } from "@resources/components/common/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@resources/components/common/Select";
import {
  $getSelection,
  $isRangeSelection,
  BaseSelection,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
  TextFormatType,
} from "lexical";
import {
  Bold,
  Code,
  FileCodeCorner,
  FilePen,
  Italic,
  Link,
  List,
  ListOrdered,
  Megaphone,
  Network,
  Underline,
} from "lucide-react";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

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

export interface ToolbarPluginProps {
  isMarkdownView?: boolean;
  setIsMarkdownView: Dispatch<SetStateAction<boolean>>;
  localMarkdown?: string;
  setLocalMarkdown: Dispatch<SetStateAction<string>>;
}

const options = [
  { label: "normal", value: "p" },
  { label: "heading 1", value: "h1" },
  { label: "heading 2", value: "h2" },
  { label: "heading 3", value: "h3" },
  { label: "heading 4", value: "h4" },
  { label: "heading 5", value: "h5" },
  { label: "heading 6", value: "h6" },
];

export function ToolbarPlugin({
  isMarkdownView = false,
  setIsMarkdownView,
  localMarkdown = "",
  setLocalMarkdown,
}: ToolbarPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [activeFormat, setActiveFormat] = useState<Set<TextFormatType>>(new Set());
  const [activeBlockType, setActiveBlockType] = useState<BlockType>("p" as BlockType);
  const [activeListType, setActiveListType] = useState<"bullet" | "number" | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);

  // Ad Banner Dialog state
  const [isAdDialogOpen, setIsAdDialogOpen] = useState(false);
  const [adFormData, setAdFormData] = useState({
    imgUrl: "",
    link: "",
    alt: "",
  });

  // Link Dialog state
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkFormData, setLinkFormData] = useState({
    text: "",
    url: "",
  });

  // Mermaid Dialog state
  const [isMermaidDialogOpen, setIsMermaidDialogOpen] = useState(false);
  const [mermaidCode, setMermaidCode] = useState("graph TD\n    A[Start] --> B[Process]\n    B --> C[End]");

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const nearestNode = $getNearestNodeOfType(anchorNode, CodeNode);
      setDisabled(nearestNode !== null);

      // Check if we're in a list
      const listNode = $getNearestNodeOfType(anchorNode, ListNode);
      if (listNode) {
        const listType = listNode.getListType();
        setActiveListType(listType === "bullet" ? "bullet" : "number");
      } else {
        setActiveListType(null);
      }

      const newActiveFormats: Set<TextFormatType> = new Set<TextFormatType>();

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
    [editor, activeFormat],
  );

  const createHeadingChange = (value: HeadingTagType) => {
    editor.update(() => {
      const selection: BaseSelection | null = $getSelection();
      if (selection && $isRangeSelection(selection)) {
        $setBlocksType(selection as BaseSelection, () => $createHeadingNode(value));
        setActiveBlockType(value as BlockType);
      }
    });
  };

  const createAdNode = () => {
    setIsAdDialogOpen(true);
  };

  const handleAdFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!adFormData.imgUrl || !adFormData.link) {
      return; // Basic validation
    }

    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Create ad banner node with form data
        const adNode = $createAdBannerNode(adFormData.imgUrl, adFormData.link, adFormData.alt);

        // Insert the node at the current selection
        selection.insertNodes([adNode]);
      }
    });

    // Reset form and close dialog
    setAdFormData({ imgUrl: "", link: "", alt: "" });
    setIsAdDialogOpen(false);
  };

  const toggleMarkdown = () => {
    setIsMarkdownView(!isMarkdownView);
    if (isMarkdownView) {
      editor.update(() => {
        $convertFromMarkdownString(localMarkdown, [...TRANSFORMERS, AD_BANNER_TRANSFORMER]);
      });
    } else {
      editor.read(() => {
        const markdownString: string = $convertToMarkdownString([...TRANSFORMERS, AD_BANNER_TRANSFORMER]);
        setLocalMarkdown(markdownString);
      });
    }
  };

  const insertCodeBlock = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createCodeNode());
      }
    });
  };

  const toggleBulletList = () => {
    if (activeListType === "bullet") {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }
  };

  const toggleNumberedList = () => {
    if (activeListType === "number") {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  const insertLink = () => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const text = selection.getTextContent();
        setLinkFormData({ text, url: "" });
      }
    });
    setIsLinkDialogOpen(true);
  };

  const insertMermaid = () => {
    setIsMermaidDialogOpen(true);
  };

  const handleMermaidSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!mermaidCode.trim()) {
      return;
    }

    editor.update(() => {
      const markdownString = $convertToMarkdownString([...TRANSFORMERS, AD_BANNER_TRANSFORMER]);
      const newMarkdown = markdownString + `\n\n\`\`\`mermaid\n${mermaidCode}\n\`\`\`\n`;

      $convertFromMarkdownString(newMarkdown, [...TRANSFORMERS, AD_BANNER_TRANSFORMER]);
      setLocalMarkdown(newMarkdown);
    });

    setIsMermaidDialogOpen(false);
    setMermaidCode("graph TD\n    A[Start] --> B[Process]\n    B --> C[End]");
  };

  const handleLinkFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!linkFormData.url) {
      return;
    }

    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (linkFormData.text && selection.isCollapsed()) {
          // Insert text with link
          selection.insertText(linkFormData.text);
          const newSelection = $getSelection();
          if ($isRangeSelection(newSelection)) {
            const anchor = newSelection.anchor;
            const textLength = linkFormData.text.length;
            anchor.set(anchor.key, anchor.offset - textLength, anchor.type);
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkFormData.url);
          }
        } else {
          // Apply link to selected text
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkFormData.url);
        }
      }
    });

    setLinkFormData({ text: "", url: "" });
    setIsLinkDialogOpen(false);
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
      <Button
        size={"icon"}
        disabled={disabled}
        variant={activeListType === "bullet" ? "default" : "outline"}
        onClick={toggleBulletList}>
        <List />
      </Button>
      <Button
        size={"icon"}
        disabled={disabled}
        variant={activeListType === "number" ? "default" : "outline"}
        onClick={toggleNumberedList}>
        <ListOrdered />
      </Button>
      <Button size={"icon"} disabled={disabled} variant={"outline"} onClick={insertLink}>
        <Link />
      </Button>
      <Button size={"icon"} variant={"outline"} onClick={insertMermaid}>
        <Network />
      </Button>
      <Button size={"icon"} onClick={createAdNode} variant={"outline"}>
        <Megaphone />
      </Button>
      <Button variant="outline" size="icon" onClick={toggleMarkdown}>
        {isMarkdownView ? <FilePen /> : <FileCodeCorner />}
      </Button>

      <AdBannerDialog
        open={isAdDialogOpen}
        onOpenChange={setIsAdDialogOpen}
        formData={adFormData}
        onFormDataChange={setAdFormData}
        onSubmit={handleAdFormSubmit}
      />

      <LinkDialog
        open={isLinkDialogOpen}
        onOpenChange={setIsLinkDialogOpen}
        formData={linkFormData}
        onFormDataChange={setLinkFormData}
        onSubmit={handleLinkFormSubmit}
      />

      <MermaidDialog
        open={isMermaidDialogOpen}
        onOpenChange={setIsMermaidDialogOpen}
        code={mermaidCode}
        onCodeChange={setMermaidCode}
        onSubmit={handleMermaidSubmit}
      />
    </div>
  );
}
