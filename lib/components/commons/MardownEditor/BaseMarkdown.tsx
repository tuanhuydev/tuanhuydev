'use client';

import { EMPTY_STRING } from '@lib/configs/constants';
import {
	BlockTypeSelect,
	BoldItalicUnderlineToggles,
	CodeBlockEditorDescriptor,
	CreateLink,
	InsertCodeBlock,
	ListsToggle,
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
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import React, { useMemo, RefObject, useEffect } from 'react';

interface EditorProps {
	markdown: string;
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
			<div onKeyDown={(e) => e.nativeEvent.stopImmediatePropagation()}>
				<textarea rows={3} cols={20} defaultValue={props.code} onChange={(e) => cb.setCode(e.target.value)} />
			</div>
		);
	},
};

export default function BaseMarkdown({
	markdown,
	onChange,
	readOnly = false,
	placeholder = 'Placeholder',
}: EditorProps) {
	const ref = React.useRef<MDXEditorMethods>(null);

	const getPlugins = useMemo(() => {
		const basePlugins = [
			toolbarPlugin({
				toolbarContents: () => (
					<>
						<BlockTypeSelect />
						<BoldItalicUnderlineToggles />
						<CreateLink />
						<ListsToggle />
						<InsertCodeBlock />
					</>
				),
			}),
			headingsPlugin(),
			listsPlugin(),
			linkPlugin(),
			linkDialogPlugin(),
			codeBlockPlugin({ defaultCodeBlockLanguage: 'txt', codeBlockEditorDescriptors: [PlainTextCodeEditorDescriptor] }),
			codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'text', tsx: 'TypeScript' } }),
		];
		if (readOnly) basePlugins.shift();
		return basePlugins;
	}, [readOnly]);

	useEffect(() => {
		if (!ref.current?.getMarkdown() && markdown) {
			ref.current?.setMarkdown(markdown);
		}
	}, [markdown]);

	return (
		<MDXEditor
			placeholder={placeholder}
			ref={ref as RefObject<MDXEditorMethods>}
			markdown={EMPTY_STRING}
			onChange={onChange}
			readOnly={readOnly}
			contentEditableClassName="min-[4rem]"
			plugins={getPlugins}
		/>
	);
}
