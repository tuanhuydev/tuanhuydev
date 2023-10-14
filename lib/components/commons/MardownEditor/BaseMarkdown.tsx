'use client';

import {
	BlockTypeSelect,
	BoldItalicUnderlineToggles,
	CodeToggle,
	CreateLink,
	MDXEditor,
	MDXEditorMethods,
	UndoRedo,
	headingsPlugin,
	linkDialogPlugin,
	linkPlugin,
	listsPlugin,
	quotePlugin,
	thematicBreakPlugin,
	toolbarPlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { FC, memo } from 'react';

interface EditorProps {
	markdown: string;
	editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

const BaseEditor: FC<EditorProps> = ({ markdown, editorRef }) => {
	return (
		<MDXEditor
			ref={editorRef}
			markdown={markdown}
			plugins={[
				headingsPlugin(),
				listsPlugin(),
				quotePlugin(),
				thematicBreakPlugin(),
				linkPlugin(),
				linkDialogPlugin(),
				toolbarPlugin({
					toolbarContents: () => (
						<>
							{' '}
							<UndoRedo />
							<BlockTypeSelect />
							<BoldItalicUnderlineToggles />
							<CodeToggle /> <CreateLink />
						</>
					),
				}),
			]}
		/>
	);
};

export default memo(BaseEditor);
