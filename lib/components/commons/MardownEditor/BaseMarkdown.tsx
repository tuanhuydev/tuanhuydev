'use client';

import { EMPTY_STRING } from '@lib/configs/constants';
import {
	CodeBlockEditorDescriptor,
	MDXEditorMethods,
	codeBlockPlugin,
	headingsPlugin,
	linkDialogPlugin,
	linkPlugin,
	listsPlugin,
	toolbarPlugin,
	useCodeBlockEditorContext,
} from '@mdxeditor/editor';

const BlockTypeSelect = dynamic(async () => (await import("@mdxeditor/editor")).BlockTypeSelect, { ssr: false, loading: () => <Loader /> });
const BoldItalicUnderlineToggles = dynamic(async () => (await import("@mdxeditor/editor")).BoldItalicUnderlineToggles, { ssr: false, loading: () => <Loader /> });
const CreateLink = dynamic(async () => (await import("@mdxeditor/editor")).CreateLink, { ssr: false, loading: () => <Loader /> });
const InsertCodeBlock = dynamic(async () => (await import("@mdxeditor/editor")).InsertCodeBlock, { ssr: false, loading: () => <Loader /> });
const ListsToggle = dynamic(async () => (await import("@mdxeditor/editor")).ListsToggle, { ssr: false, loading: () => <Loader /> });
const MDXEditor = dynamic(async () => (await import("@mdxeditor/editor")).MDXEditor, { ssr: false, loading: () => <Loader /> });

import '@mdxeditor/editor/style.css';
import dynamic from 'next/dynamic';
import React, { useMemo, RefObject, useEffect } from 'react';
import Loader from '../Loader';

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
];

export default function BaseMarkdown({
	markdown,
	onChange,
	readOnly = false,
	placeholder = 'Placeholder',
}: EditorProps) {
	const ref = React.useRef<MDXEditorMethods>(null);

	if (readOnly) basePlugins.shift();

	useEffect(() => {
		if (!ref.current?.getMarkdown() && markdown) ref.current?.setMarkdown(markdown);
	}, [markdown]);

	return (
		<MDXEditor
			placeholder={placeholder}
			ref={ref as RefObject<MDXEditorMethods>}
			markdown={EMPTY_STRING}
			onChange={onChange}
			readOnly={readOnly}
			contentEditableClassName="min-[4rem]"
			plugins={basePlugins}
		/>
	);
}
