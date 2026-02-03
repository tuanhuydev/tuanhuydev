import { $convertFromMarkdownString, $convertToMarkdownString, TRANSFORMERS, Transformer } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { useEffect } from "react";

export interface ImportMarkdownPluginProps {
  markdown: string;
  transformers?: Array<Transformer>;
}

export function ImportMarkdownPlugin({ markdown, transformers = TRANSFORMERS }: ImportMarkdownPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      const currentContent = $convertToMarkdownString(transformers);

      if (markdown !== currentContent) {
        const root = $getRoot();
        root.clear();
        $convertFromMarkdownString(markdown, transformers);
      }
    });
  }, [editor, markdown, transformers]);

  return null;
}
