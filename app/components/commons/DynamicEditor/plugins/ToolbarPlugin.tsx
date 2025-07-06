"use client";

import { $createImageNode } from "../nodes/ImageNode";
import { $createCodeNode, $isCodeNode, CODE_LANGUAGE_FRIENDLY_NAME_MAP, CODE_LANGUAGE_MAP } from "@lexical/code";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from "@lexical/list";
import { $isListNode, ListNode, ListType } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, $createQuoteNode, $isHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
// MUI Icons
import CodeIcon from "@mui/icons-material/Code";
import DataObjectIcon from "@mui/icons-material/DataObject";
import EditIcon from "@mui/icons-material/Edit";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import ImageIcon from "@mui/icons-material/Image";
import RedoIcon from "@mui/icons-material/Redo";
import UndoIcon from "@mui/icons-material/Undo";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Toolbar,
} from "@mui/material";
import {
  $createParagraphNode,
  $createTextNode,
  $getSelection,
  $insertNodes,
  $isElementNode,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useState } from "react";

interface ToolbarPluginProps {
  showModeToggle?: boolean;
  viewMode?: "rich" | "markdown";
  onViewModeChange?: (mode: "rich" | "markdown") => void;
}

const ToolbarPlugin: React.FC<ToolbarPluginProps> = ({
  showModeToggle = true,
  viewMode = "rich",
  onViewModeChange,
}) => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isList, setIsList] = useState(false);
  const [listType, setListType] = useState<ListType | null>(null);

  // Dialog states
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState("javascript");

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));

      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow();

      if ($isHeadingNode(element)) {
        setBlockType(`h${element.getTag()}`);
      } else {
        setBlockType(element.getType());
      }

      // Check if we're in a list
      const listNode = $isListNode(element) ? element : element.getParent();
      if ($isListNode(listNode)) {
        setIsList(true);
        setListType(listNode.getListType());
      } else {
        setIsList(false);
        setListType(null);
      }
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const formatText = (format: "bold" | "italic" | "underline" | "code") => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatHeading = (headingSize: string) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          if (headingSize === "paragraph") {
            $setBlocksType(selection, () => $createParagraphNode());
          } else {
            $setBlocksType(selection, () => $createHeadingNode(headingSize as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"));
          }
        }
      });
    }
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    const editorContainer = document.querySelector(".dynamic-editor");
    if (editorContainer) {
      if (!isFullscreen) {
        editorContainer.classList.add("fullscreen");
      } else {
        editorContainer.classList.remove("fullscreen");
      }
    }
  };

  const toggleBulletList = () => {
    if (isList && listType === "bullet") {
      // Remove list if already a bullet list
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      // Convert to bullet list
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }
  };

  const toggleNumberedList = () => {
    if (isList && listType === "number") {
      // Remove list if already a numbered list
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      // Convert to numbered list
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  const handleInsertCodeBlock = () => {
    setCodeDialogOpen(true);
  };

  const handleConfirmCodeBlock = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const codeNode = $createCodeNode(codeLanguage);
        $insertNodes([codeNode]);
      }
    });
    setCodeDialogOpen(false);
  };

  const handleInsertImage = () => {
    setImageUrl("");
    setImageAlt("");
    setImageDialogOpen(true);
  };

  const handleConfirmImage = () => {
    if (imageUrl) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          // Create and insert image node
          const imageNode = $createImageNode({
            src: imageUrl,
            altText: imageAlt || "",
          });
          $insertNodes([imageNode]);
        }
      });
    }
    setImageDialogOpen(false);
    setImageUrl("");
    setImageAlt("");
  };

  return (
    <>
      <Box className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-wrap">
        {/* Block Type Selector + Text Formatting */}
        <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
          <Select value={blockType} onChange={(e) => formatHeading(e.target.value)} displayEmpty>
            <MenuItem value="paragraph">Paragraph</MenuItem>
            <MenuItem value="h1">Heading 1</MenuItem>
            <MenuItem value="h2">Heading 2</MenuItem>
            <MenuItem value="h3">Heading 3</MenuItem>
            <MenuItem value="h4">Heading 4</MenuItem>
            <MenuItem value="h5">Heading 5</MenuItem>
            <MenuItem value="h6">Heading 6</MenuItem>
          </Select>
        </FormControl>

        <Tooltip title="Bold">
          <IconButton onClick={() => formatText("bold")} size="small" color={isBold ? "primary" : "default"}>
            <FormatBoldIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Italic">
          <IconButton onClick={() => formatText("italic")} size="small" color={isItalic ? "primary" : "default"}>
            <FormatItalicIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Underline">
          <IconButton onClick={() => formatText("underline")} size="small" color={isUnderline ? "primary" : "default"}>
            <FormatUnderlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Inline Code">
          <IconButton onClick={() => formatText("code")} size="small">
            <CodeIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Lists, Quote, Image, Code */}
        <Tooltip title="Bullet List">
          <IconButton
            onClick={toggleBulletList}
            size="small"
            color={isList && listType === "bullet" ? "primary" : "default"}>
            <FormatListBulletedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Numbered List">
          <IconButton
            onClick={toggleNumberedList}
            size="small"
            color={isList && listType === "number" ? "primary" : "default"}>
            <FormatListNumberedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Quote">
          <IconButton onClick={formatQuote} size="small" color={blockType === "quote" ? "primary" : "default"}>
            <FormatQuoteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Insert Image">
          <IconButton onClick={handleInsertImage} size="small">
            <ImageIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Code Block">
          <IconButton onClick={handleInsertCodeBlock} size="small">
            <DataObjectIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Undo/Redo */}
        <Tooltip title="Undo">
          <IconButton onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} size="small">
            <UndoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Redo">
          <IconButton onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} size="small">
            <RedoIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Mode Toggle */}
        {showModeToggle && (
          <>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, newMode) => newMode && onViewModeChange?.(newMode)}
              size="small"
              aria-label="editor mode">
              <ToggleButton value="rich" aria-label="rich text mode">
                <Tooltip title="Rich Text Mode">
                  <EditIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="markdown" aria-label="markdown mode">
                <Tooltip title="Markdown Mode">
                  <VisibilityIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </>
        )}

        {/* Fullscreen */}
        <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
          <IconButton onClick={toggleFullscreen} size="small">
            {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)}>
        <DialogTitle>Insert Image</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Image URL"
            fullWidth
            variant="outlined"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Alt Text (optional)"
            fullWidth
            variant="outlined"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmImage} variant="contained">
            Insert
          </Button>
        </DialogActions>
      </Dialog>

      {/* Code Block Dialog */}
      <Dialog open={codeDialogOpen} onClose={() => setCodeDialogOpen(false)}>
        <DialogTitle>Insert Code Block</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Language</InputLabel>
            <Select value={codeLanguage} label="Language" onChange={(e) => setCodeLanguage(e.target.value)}>
              <MenuItem value="javascript">JavaScript</MenuItem>
              <MenuItem value="typescript">TypeScript</MenuItem>
              <MenuItem value="python">Python</MenuItem>
              <MenuItem value="bash">Bash</MenuItem>
              <MenuItem value="sql">SQL</MenuItem>
              <MenuItem value="json">JSON</MenuItem>
              <MenuItem value="css">CSS</MenuItem>
              <MenuItem value="html">HTML</MenuItem>
              <MenuItem value="jsx">JSX</MenuItem>
              <MenuItem value="tsx">TSX</MenuItem>
              <MenuItem value="php">PHP</MenuItem>
              <MenuItem value="java">Java</MenuItem>
              <MenuItem value="cpp">C++</MenuItem>
              <MenuItem value="go">Go</MenuItem>
              <MenuItem value="rust">Rust</MenuItem>
              <MenuItem value="yaml">YAML</MenuItem>
              <MenuItem value="xml">XML</MenuItem>
              <MenuItem value="markdown">Markdown</MenuItem>
              <MenuItem value="plaintext">Plain Text</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCodeDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmCodeBlock} variant="contained">
            Insert
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ToolbarPlugin;
