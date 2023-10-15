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
	onChange?: any;
}

const BaseEditor: FC<EditorProps> = ({ markdown, editorRef, onChange }) => {
	return (
		<MDXEditor
			ref={editorRef}
			markdown={markdown}
			onChange={onChange}
			contentEditableClassName="prose"
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
